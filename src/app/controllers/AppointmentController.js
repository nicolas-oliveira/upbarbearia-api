import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import Notification from '../schemas/Notification';

import Mail from '../../lib/Mail';

class AppointmentController {
  // Listar os appointments que o usuário atual solicitou
  async index(request, response) {
    const { page = 1 } = request.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: request.userId,
        cancelled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date', 'created_at', 'user_id'],
      limit: 20,
      offset: (page - 1) * 20, // Quantidade a ser mostrada na paginação
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'url'],
            },
          ],
        },
      ],
    });
    return response.json(appointments);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = request.body;

    // Verificar se o provider_id é um provider
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return response
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    if (request.userId === provider_id) {
      return response
        .status(400)
        .json({ error: 'You can only create appointments with other user' });
    }

    const hourStart = startOfHour(parseISO(date));
    // Verificar se está em datas anteriores
    if (isBefore(hourStart, new Date())) {
      return response
        .status(400)
        .json({ error: 'Past dates are not permitted' });
    }

    // Checar a disponibilidade da data
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        cancelled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return response
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: request.userId,
      provider_id,
      date: hourStart, // evitar o horário quebrado
    });

    // Notifica ao provider a solicitação
    const user = await User.findByPk(request.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return response.json(appointment);
  }

  async delete(request, response) {
    const appointment = await Appointment.findByPk(request.params.id, {
      include: [
        // Informações para o envio do email
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== request.userId) {
      return response.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return response.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }

    appointment.cancelled_at = new Date();

    await appointment.save();

    // Envio dos emails
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      sbject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });
    console.log('fala fiote');
    return response.json(appointment);
  }
}

export default new AppointmentController();
