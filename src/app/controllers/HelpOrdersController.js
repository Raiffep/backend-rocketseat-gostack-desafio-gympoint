import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';
import Mail from '../../lib/Mail';

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

    const helpOrders = await HelpOrder.findAll({ where: { student_id } });

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

    const student = await Student.findByPk(helpOrder.student_id);

    const answerUpdate = await helpOrder.update({ answer, answer_at });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Pedido respondido!',
      template: 'helpOrder',
      context: {
        student: student.name,
        questionDate: format(
          helpOrder.createdAt,
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        question: helpOrder.question,
        answerDate: format(answer_at, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
        answer,
      },
    });

    return res.json({ answerUpdate });
  }
}

export default new HelpOrdersController();
