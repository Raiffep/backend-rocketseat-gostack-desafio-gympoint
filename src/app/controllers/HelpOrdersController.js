import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrdersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.params.id);
    const { question } = req.body;

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const student_id = student.id;

    const { id } = await HelpOrder.create({ student_id, question });

    return res.json({ id, student_id, question });
  }

  async index(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const student_id = student.id;

    const helpOrders = await HelpOrder.findAll({ where: student_id });

    return res.json(helpOrders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const helpOrder = await HelpOrder.findByPk(req.params.id);

    if (!helpOrder) {
      return res.status(401).json({ error: 'Help order not found' });
    }
    const { answer } = req.body;
    const answer_at = new Date();

    const answerUpdate = await helpOrder.update({ answer, answer_at });

    return res.json({ answerUpdate });
  }
}

export default new HelpOrdersController();
