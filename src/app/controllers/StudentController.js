import * as Yup from 'yup';
import Student from '../models/Student';

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

    const { name, email, idade, peso, altura } = Student.create(req.body);
    return res.json({ name, email, idade, peso, altura });
  }

  async showAll(req, res) {
    const students = await Student.findAll();
    return res.json(students);
  }
}

export default new StudentController();
