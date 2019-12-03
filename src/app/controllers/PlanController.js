import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);
    return res.json({ id, title, duration, price });
  }

  async showAll(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const planId = req.params.id;
    const { title } = req.body;
    const plan = await Plan.findByPk(planId);

    if (!plan) {
      res.status(400).json({ error: 'Plan does not exists ' });
    }

    if (title === plan.title) {
      return res.status(400).json({ error: 'Title is already in use' });
    }
    const { id } = await plan.update(req.body);
    return res.json({ id, title });
  }

  async delete(req, res) {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    await Plan.destroy({ where: { id } });
    return res.json({ message: 'Plan deleted!' });
  }
}

export default new PlanController();
