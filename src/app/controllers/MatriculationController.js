import * as Yup from 'yup';
import { startOfHour, addMonths, parseISO, isBefore } from 'date-fns';
import Matriculation from '../models/Matriculation';
import Student from '../models/Student';
import Plan from '../models/Plan';
import MatriculationMail from '../jobs/MatricullationMail';
import Queue from '../../lib/Queue';

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

    await Queue.add(MatriculationMail.key, {
      student,
      plan,
      matriculation,
      startDate,
      end_date,
      price,
    });

    return res.json(matriculation);
  }

  async index(req, res) {
    const matriculations = await Matriculation.findAll();

    return res.json(matriculations);
  }
}

export default new MatriculationController();
