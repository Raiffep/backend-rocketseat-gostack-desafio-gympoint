import * as Yup from 'yup';
import Student from '../models/Student';
import Checkin from '../models/Checkin';

let count = 0;

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number().required(),
      peso: Yup.number().required(),
      altura: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fail' });
    }

    const studentExists = await Student.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const { id, name, email, idade, peso, altura } = await Student.create(
      req.body
    );
    return res.json({ id, name, email, idade, peso, altura });
  }

  async index(req, res) {
    const students = await Student.findAll();
    return res.json(students);
  }

  async checkin(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const student_id = student.id;

    if (count === 5) {
      return res
        .status(401)
        .json({ error: 'Max number of checkins in this week!' });
    }

    const checkin = await Checkin.create({ student_id });

    if (checkin) {
      count += 1;
    }

    const { id, name, email } = student;

    return res.json({
      user: {
        id,
        name,
        email,
      },
    });
  }
}

export default new StudentController();
