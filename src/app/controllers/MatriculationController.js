import * as Yup from 'yup';
import Matriculation from '../models/Matriculation';
import Student from '../models/Student';
import Plan from '../models/Plan';

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

    const [date, hourTimeZone] = start_date.split('T');
    const [year, mouth, day] = date.split('-');
    const [hour, timeZone] = hourTimeZone.split('-');
    const [hora, minuto, segundo] = hour.split(':');

    const endMouth = (parseFloat(mouth) + plan.duration - 1).toString();
    const price = plan.duration * plan.price;

    const end_date = new Date(year, endMouth, day, hora);

    await Matriculation.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    const matriculation = {
      Name: student.name,
      Plan: plan.title,
      'Start Date': start_date,
      'End Date': end_date,
      Price: `R$ ${price},00`,
    };

    return res.json(matriculation);
  }

  async index(req, res) {
    const matriculations = await Matriculation.findAll();

    return res.json(matriculations);
  }
}

export default new MatriculationController();
