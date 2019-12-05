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

    const newDate = new Date(start_date);
    let newMonth = newDate.getMonth();
    newMonth += plan.duration;
    const endDate = newDate.setMonth(newMonth);
    const price = plan.duration * plan.price;

    const end_date = new Date(endDate);

    const matriculation = await Matriculation.create({
      student_id,
      plan_id,
      start_date,
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
