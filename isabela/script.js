const availableTimes = ["13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
const serviceDurations = {
  "Alongamento em gel": 120,
  "Banho de gel": 90,
  "Blindagem": 60,
  "Esmaltação em gel": 60,
  "Manutenção de alongamento": 120,
  "Manutenção em banho de gel": 90,
};
const form = document.querySelector("#booking-form");
const dateInput = document.querySelector("#date");
const serviceSelect = document.querySelector("#service");
const timeSelect = document.querySelector("#time");
const appointmentsList = document.querySelector("#appointments");
const selectedDateLabel = document.querySelector("#selected-date-label");
const formMessage = document.querySelector("#form-message");
const appointmentTemplate = document.querySelector("#appointment-template");
const historyList = document.querySelector("#appointment-history");
const historyTemplate = document.querySelector("#history-template");
const storageKey = "isabela-meneguzzi-nails-appointments";

const getAppointments = () => JSON.parse(localStorage.getItem(storageKey) || "[]");
const saveAppointments = (appointments) => localStorage.setItem(storageKey, JSON.stringify(appointments));

function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(new Date(`${date}T12:00:00`));
}

function isMonday(date) {
  return new Date(`${date}T12:00:00`).getDay() === 1;
}

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function getDuration(service) {
  const serviceName = service.split(" - ")[0];
  return serviceDurations[serviceName] || 60;
}

function getAppointmentKey(appointment) {
  return `${appointment.date}|${appointment.time}|${appointment.clientName}|${appointment.service}`;
}

function overlapsAppointment(time, duration, appointment) {
  const start = toMinutes(time);
  const end = start + duration;
  const appointmentStart = toMinutes(appointment.time);
  const appointmentEnd = appointmentStart + getDuration(appointment.service);
  return start < appointmentEnd && end > appointmentStart;
}

function updateSchedule() {
  const selectedDate = dateInput.value;
  const appointments = getAppointments()
    .filter((appointment) => appointment.date === selectedDate)
    .sort((first, second) => first.time.localeCompare(second.time));

  selectedDateLabel.textContent = selectedDate ? formatDate(selectedDate) : "Selecione uma data para visualizar.";
  appointmentsList.innerHTML = "";
  updateHistory();

  if (!selectedDate || appointments.length === 0) {
    appointmentsList.innerHTML = `<li class="empty-state">${selectedDate ? "Ainda há horários disponíveis nesta data." : "Os seus agendamentos aparecerão aqui."}</li>`;
    return;
  }

  appointments.forEach((appointment) => {
    const item = appointmentTemplate.content.cloneNode(true);
    const endTime = toTime(toMinutes(appointment.time) + getDuration(appointment.service));
    item.querySelector(".appointment-time").textContent = `${appointment.time} - ${endTime}`;
    item.querySelector(".appointment-client").textContent = appointment.clientName;
    item.querySelector(".appointment-service").textContent = appointment.service;
    appointmentsList.append(item);
  });
}

function updateHistory() {
  const appointments = getAppointments()
    .sort((first, second) => `${second.date}${second.time}`.localeCompare(`${first.date}${first.time}`));

  historyList.innerHTML = "";

  if (appointments.length === 0) {
    historyList.innerHTML = '<li class="empty-state">Nenhum agendamento realizado ainda.</li>';
    return;
  }

  appointments.forEach((appointment) => {
    const item = historyTemplate.content.cloneNode(true);
    const endTime = toTime(toMinutes(appointment.time) + getDuration(appointment.service));
    item.querySelector(".history-date").textContent = formatDate(appointment.date);
    item.querySelector(".history-client").textContent = appointment.clientName;
    item.querySelector(".history-details").textContent = `${appointment.service} | ${appointment.time} - ${endTime}`;
    item.querySelector(".cancel-button").dataset.appointmentKey = getAppointmentKey(appointment);
    historyList.append(item);
  });
}

function updateAvailableTimes() {
  const selectedDate = dateInput.value;
  const isAvailableDay = selectedDate && isMonday(selectedDate);
  const selectedService = serviceSelect.value;
  const duration = getDuration(selectedService);
  const appointments = getAppointments().filter((appointment) => appointment.date === selectedDate);

  timeSelect.innerHTML = '<option value="">Selecione o horário</option>';
  timeSelect.disabled = !isAvailableDay || !selectedService;

  if (selectedDate && !isAvailableDay) {
    timeSelect.innerHTML = '<option value="">Atendimentos somente às segundas</option>';
    updateSchedule();
    return;
  }

  if (selectedDate && !selectedService) {
    timeSelect.innerHTML = '<option value="">Selecione o serviço primeiro</option>';
    updateSchedule();
    return;
  }

  availableTimes.forEach((time) => {
    const isBooked = appointments.some((appointment) => overlapsAppointment(time, duration, appointment));
    const option = new Option(isBooked ? `${time} - indisponível` : time, time);
    option.disabled = isBooked;
    timeSelect.add(option);
  });

  updateSchedule();
}

function setMinimumDate() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.min = today.toISOString().slice(0, 10);

  if (!dateInput.value) {
    const nextMonday = new Date(today);
    const daysUntilMonday = (8 - nextMonday.getDay()) % 7;
    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
    dateInput.value = nextMonday.toISOString().slice(0, 10);
  }
}

dateInput.addEventListener("change", () => {
  formMessage.textContent = dateInput.value && !isMonday(dateInput.value)
    ? "Escolha uma segunda-feira para agendar."
    : "";
  updateAvailableTimes();
});

serviceSelect.addEventListener("change", () => {
  formMessage.textContent = "";
  updateAvailableTimes();
});

historyList.addEventListener("click", (event) => {
  const cancelButton = event.target.closest(".cancel-button");

  if (!cancelButton || !confirm("Deseja cancelar este agendamento?")) {
    return;
  }

  const remainingAppointments = getAppointments().filter(
    (appointment) => getAppointmentKey(appointment) !== cancelButton.dataset.appointmentKey,
  );
  saveAppointments(remainingAppointments);
  formMessage.textContent = "Agendamento cancelado. O horário está disponível novamente.";
  updateAvailableTimes();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const booking = Object.fromEntries(new FormData(form));

  if (!isMonday(booking.date)) {
    formMessage.textContent = "Os atendimentos estão disponíveis somente às segundas-feiras.";
    updateAvailableTimes();
    return;
  }

  const duration = getDuration(booking.service);
  const appointments = getAppointments();
  const timeIsTaken = appointments.some(
    (appointment) => appointment.date === booking.date && overlapsAppointment(booking.time, duration, appointment),
  );

  if (timeIsTaken) {
    formMessage.textContent = "Este período já está reservado. Escolha outro horário.";
    updateAvailableTimes();
    return;
  }

  appointments.push(booking);
  saveAppointments(appointments);
  formMessage.textContent = `Agendamento confirmado para ${formatDate(booking.date)}, das ${booking.time} às ${toTime(toMinutes(booking.time) + duration)}.`;
  form.reset();
  dateInput.value = booking.date;
  updateAvailableTimes();
});

setMinimumDate();
updateAvailableTimes();
