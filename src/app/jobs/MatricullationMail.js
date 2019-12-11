import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class MatriculationMail {
  get key() {
    return 'MatriculationMail';
  }

  async handle({ data }) {
    const { student, plan, matriculation, startDate, end_date, price } = data;
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula efetuada!',
      template: 'matriculation',
      context: {
        student: student.name,
        plan: plan.title,
        matriculationDate: format(
          parseISO(matriculation.createdAt),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        startDate: format(
          parseISO(startDate),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        endDate: format(
          parseISO(end_date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        totalValue: `R$ ${price},00`,
      },
    });
  }
}

export default new MatriculationMail();
