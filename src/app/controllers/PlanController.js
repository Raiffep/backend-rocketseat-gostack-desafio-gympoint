import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const { id, title, duration, price } = await Plan.create(req.body);
    return res.json({ id, title, duration, price });
  }

  async showAll(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }
}

export default new PlanController();
