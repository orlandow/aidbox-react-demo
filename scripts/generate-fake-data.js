import axios from 'axios';

const FHIR_BASE_URL = 'http://localhost:8080/fhir';

// US names (80%)
const usNames = {
  male: {
    given: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua'],
    family: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
  },
  female: {
    given: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle'],
    family: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
  }
};

// More diverse names (20%)
const diverseNames = {
  male: {
    given: ['Ahmed', 'Chen', 'Raj', 'Diego', 'Kofi', 'Hiroshi', 'Dmitri', 'Giovanni', 'Hassan', 'Kwame', 'Lars', 'Pierre', 'Ravi', 'Sven', 'Tariq'],
    family: ['Patel', 'Zhang', 'Singh', 'Kim', 'Nguyen', 'Ali', 'Hassan', 'Kumar', 'Chen', 'Wu', 'Ahmed', 'Khan', 'Okafor', 'Andersson', 'Rossi']
  },
  female: {
    given: ['Priya', 'Mei', 'Fatima', 'Sofia', 'Aisha', 'Yuki', 'Ingrid', 'Francesca', 'Zara', 'Amara', 'Ling', 'Noor', 'Kaia', 'Elena', 'Zoe'],
    family: ['Patel', 'Zhang', 'Singh', 'Kim', 'Nguyen', 'Ali', 'Hassan', 'Kumar', 'Chen', 'Wu', 'Ahmed', 'Khan', 'Okafor', 'Andersson', 'Rossi']
  }
};

const fakeDomains = ['example.com', 'fakemail.org', 'testdomain.net', 'sample.co', 'mockmail.io'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePhoneNumber() {
  // Generate US-style phone number
  const area = Math.floor(Math.random() * 800) + 200; // 200-999
  const exchange = Math.floor(Math.random() * 800) + 200; // 200-999
  const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${area}${exchange}${number}`;
}

function generateEmail(firstName, lastName) {
  const domain = getRandomElement(fakeDomains);
  const variations = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${Math.floor(Math.random() * 100)}@${domain}`,
    `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}@${domain}`
  ];
  return getRandomElement(variations);
}

function generateBirthDate() {
  const currentYear = new Date().getFullYear();
  const minAge = 20;
  const maxAge = 80;
  const birthYear = currentYear - minAge - Math.floor(Math.random() * (maxAge - minAge));
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1; // Use 28 to avoid month-specific issues
  
  return `${birthYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function generatePatient() {
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const isUSName = Math.random() < 0.8; // 80% US names, 20% diverse
  
  const nameSource = isUSName ? usNames[gender] : diverseNames[gender];
  const firstName = getRandomElement(nameSource.given);
  const lastName = getRandomElement(nameSource.family);
  
  const patient = {
    resourceType: 'Patient',
    name: [{
      given: [firstName],
      family: lastName
    }],
    gender: gender,
    birthDate: generateBirthDate()
  };
  
  // 40% chance of having phone/email
  if (Math.random() < 0.4) {
    patient.telecom = [];
    
    // Always add phone if telecom exists
    patient.telecom.push({
      system: 'phone',
      value: generatePhoneNumber(),
      use: 'home'
    });
    
    // Add email too
    patient.telecom.push({
      system: 'email',
      value: generateEmail(firstName, lastName),
      use: 'home'
    });
  }
  
  return patient;
}

function generateAppointmentDate() {
  const today = new Date();
  const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  
  let appointmentDate;
  let attempts = 0;
  
  // Keep generating dates until we get a weekday (Monday-Friday)
  do {
    const randomTime = today.getTime() + (Math.random() - 0.5) * 2 * oneMonth;
    appointmentDate = new Date(randomTime);
    attempts++;
    
    // Safety check to prevent infinite loop
    if (attempts > 100) break;
  } while (appointmentDate.getDay() === 0 || appointmentDate.getDay() === 6); // 0 = Sunday, 6 = Saturday
  
  // Set to business hours (9 AM - 5 PM)
  const hour = 9 + Math.floor(Math.random() * 8); // 9-16 (5 PM)
  const minute = Math.random() < 0.5 ? 0 : 30; // Either :00 or :30
  
  appointmentDate.setHours(hour, minute, 0, 0);
  
  return appointmentDate;
}

function generateAppointment(patientReference, patientName) {
  const startDate = generateAppointmentDate();
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes later
  const today = new Date();
  
  const appointmentTypes = [
    { code: 'ROUTINE', display: 'Routine appointment - default if not valued' },
    { code: 'CHECKUP', display: 'A routine check-up, such as an annual physical' },
    { code: 'FOLLOWUP', display: 'A follow up visit from a previous appointment' },
    { code: 'EMERGENCY', display: 'Emergency appointment' }
  ];
  
  // Determine status based on appointment date
  let status;
  if (startDate < today) {
    status = 'fulfilled'; // All past appointments are fulfilled
  } else {
    // Future appointments: 50% booked, 50% pending
    status = Math.random() < 0.5 ? 'booked' : 'pending';
  }
  
  const appointmentType = getRandomElement(appointmentTypes);
  
  return {
    resourceType: 'Appointment',
    status: status,
    appointmentType: {
      coding: [{
        system: 'http://terminology.hl7.org/CodeSystem/v2-0276',
        code: appointmentType.code,
        display: appointmentType.display
      }],
      text: appointmentType.display
    },
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    minutesDuration: 30,
    participant: [{
      actor: {
        reference: `Patient/${patientReference}`,
        display: patientName
      },
      status: 'accepted'
    }]
  };
}

async function createResource(resource) {
  try {
    const response = await axios.post(`${FHIR_BASE_URL}/${resource.resourceType}`, resource, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating ${resource.resourceType}:`, error.response?.data || error.message);
    return null;
  }
}

async function generateFakeData() {
  console.log('Generating fake patients and appointments...');
  
  const patients = [];
  const patientCount = 500; // Generate 500 patients
  
  // Create patients
  for (let i = 0; i < patientCount; i++) {
    const patient = generatePatient();
    const createdPatient = await createResource(patient);
    
    if (createdPatient) {
      patients.push(createdPatient);
      if (i % 50 === 0) {
        console.log(`Created ${i + 1} patients...`);
      }
    }
  }
  
  console.log(`Created ${patients.length} patients`);
  
  // Create appointments with distribution:
  // 30% no appointments, 60% 1 appointment, 10% 2 appointments
  let appointmentCount = 0;
  for (let i = 0; i < patients.length; i++) {
    const patient = patients[i];
    let numAppointments = 0;
    
    const rand = Math.random();
    if (rand < 0.3) {
      numAppointments = 0; // 30% no appointments
    } else if (rand < 0.9) {
      numAppointments = 1; // 60% one appointment
    } else {
      numAppointments = 2; // 10% two appointments
    }
    
    for (let j = 0; j < numAppointments; j++) {
      const patientName = `${patient.name[0].given[0]} ${patient.name[0].family}`;
      const appointment = generateAppointment(patient.id, patientName);
      const createdAppointment = await createResource(appointment);
      
      if (createdAppointment) {
        appointmentCount++;
      }
    }
    
    if (i % 100 === 0) {
      console.log(`Processed ${i + 1} patients, created ${appointmentCount} appointments so far...`);
    }
  }
  
  console.log(`Created ${appointmentCount} appointments`);
  console.log('Fake data generation complete!');
}

// Run the script
generateFakeData().catch(console.error);
