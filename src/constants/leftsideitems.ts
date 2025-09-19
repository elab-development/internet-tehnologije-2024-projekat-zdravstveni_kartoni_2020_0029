export const adminMenuItems = [
  { link: "/doctors", label: "Doctors" },
  { link: "/patients", label: "Patients" },
  { link: "/appointments", label: "Appointments" },
];

export const patientMenuItems = [
  { link: "/patients/medical-record/:id", label: "Medical Record" },
  { link: "/appointments", label: "Appointments" },
];

export const doctorMenuItems = [
  { link: "/patients", label: "Medical Record" },
  { link: "/appointments", label: "Appointments" },
];
