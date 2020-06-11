import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

// Lista todos os agendamentos do provider no dia requisitado (query)
class Schedulecontroller {
  async index(request, response) {
    const checkUserProvider = await User.findOne({
      where: { id: request.userId, provider: true },
    });

    if (!checkUserProvider) {
      return response.status(400).json({ error: 'User is not a provider' });
    }

    const { date } = request.query;
    const parseDate = parseISO(date);

    // Busca no dia especificado os agendamentos
    const appointments = await Appointment.findAll({
      where: {
        provider_id: request.userId,
        cancelled_at: null,
        date: {
          // O primeiro está em colchetes para setar como nome do objeto
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: ['date'],
    });
    return response.json(appointments);
  }
}

export default new Schedulecontroller();
