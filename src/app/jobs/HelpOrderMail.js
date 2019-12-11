import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail';
  }

  async handle({ data }) {
    const { student, instructor, helpOrder, answer, answer_at } = data;
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Pedido respondido!',
      template: 'helpOrder',
      context: {
        student: student.name,
        instructor: instructor.name,
        questionDate: format(
          parseISO(helpOrder.createdAt),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        question: helpOrder.question,
        answerDate: format(
          parseISO(answer_at),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        answer,
      },
    });
  }
}

export default new HelpOrderMail();
