import * as Yup from 'yup';
import { startOfHour, addMonths, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Matriculation from '../models/Matriculation';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Mail from '../../lib/Mail';

class MatriculationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);
    const plan = await Plan.findByPk(plan_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const isMatriculated = await Matriculation.findOne({
      where: { student_id },
    });

    if (isMatriculated) {
      return res
        .status(400)
        .json({ error: 'This student is already matriculated in a plan' });
    }

    const startDate = startOfHour(parseISO(start_date));

    if (isBefore(startDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const end_date = addMonths(startDate, plan.duration);
    const price = plan.duration * plan.price;

    const matriculation = await Matriculation.create({
      student_id,
      plan_id,
      start_date: startDate,
      end_date,
      price,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula efetuada!',
      template: 'matriculation',
      context: {
        student: student.name,
        plan: plan.title,
        matriculationDate: format(
          matriculation.createdAt,
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        startDate: format(startDate, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
        endDate: format(end_date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
        totalValue: `R$ ${price},00`,
      },
    });

    return res.json(matriculation);
  }

  async index(req, res) {
    const matriculations = await Matriculation.findAll();

    return res.json(matriculations);
  }
}

export default new MatriculationController();
