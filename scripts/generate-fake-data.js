import axios from 'axios';

const FHIR_BASE_URL = 'http://localhost:8080/fhir';

// US names
const usNames = {
  male: {
    given: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Patrick', 'Frank', 'Raymond', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Henry', 'Adam', 'Douglas', 'Nathan', 'Peter', 'Zachary', 'Kyle', 'Noah', 'Alan', 'Ethan', 'Jeremy', 'Lionel', 'Wayne', 'Carl', 'Ralph', 'Roy', 'Eugene', 'Louis', 'Philip', 'Bobby', 'Sean', 'Jordan', 'Mason', 'Todd', 'Fred', 'Howard', 'Willie', 'Juan', 'Victor', 'Arthur', 'Harold', 'Albert', 'Roger', 'Martin', 'Billy', 'Kenneth', 'Wayne', 'Ralph', 'Lawrence', 'Russell', 'Louis', 'Philip', 'Walter', 'Ethan', 'Patrick', 'Peter', 'Henry', 'Carl', 'Russell', 'Earl', 'Ralph', 'Eugene', 'Leonard', 'Roy', 'Willie', 'Billy', 'Wayne', 'Jonathan', 'Wayne', 'Gary', 'Dennis', 'Frank', 'Alexander', 'Harold', 'Raymond', 'Jack', 'Harold', 'Jordan', 'Carl', 'Jerry', 'Paul', 'Samuel', 'Aaron', 'Larry', 'Ralph', 'Roy', 'Ralph', 'Eugene', 'Wayne', 'Roger', 'Henry', 'Keith', 'Craig', 'Victor', 'Jesse', 'Carl', 'Billy', 'Arthur', 'Roger'],
    family: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes', 'Gonzales', 'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham', 'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West', 'Cole', 'Hayes', 'Bryant', 'Herrera', 'Gibson', 'Ellis', 'Tran', 'Medina', 'Aguilar', 'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall', 'Owens', 'Harrison']
  },
  female: {
    given: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Sarah', 'Kimberly', 'Deborah', 'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Sarah', 'Kimberly', 'Deborah', 'Dorothy', 'Amy', 'Angela', 'Ashley', 'Brenda', 'Emma', 'Olivia', 'Cynthia', 'Marie', 'Janet', 'Catherine', 'Frances', 'Christine', 'Samantha', 'Debra', 'Rachel', 'Carolyn', 'Janet', 'Virginia', 'Maria', 'Heather', 'Diane', 'Julie', 'Joyce', 'Victoria', 'Kelly', 'Christina', 'Joan', 'Evelyn', 'Lauren', 'Judith', 'Megan', 'Cheryl', 'Andrea', 'Hannah', 'Jacqueline', 'Martha', 'Gloria', 'Teresa', 'Sara', 'Janice', 'Marie', 'Julia', 'Heather', 'Diane', 'Ruth', 'Julie', 'Joyce', 'Virginia', 'Victoria', 'Kelly', 'Christina', 'Joan', 'Evelyn', 'Lauren', 'Judith', 'Olivia', 'Frances', 'Megan', 'Cheryl', 'Andrea', 'Hannah', 'Jacqueline', 'Martha', 'Gloria', 'Teresa', 'Sara', 'Janice', 'Marie', 'Julia', 'Kathryn', 'Grace', 'Judy', 'Theresa', 'Madison', 'Beverly', 'Denise', 'Charlotte', 'Diana', 'Sophia', 'Kayla', 'Alexis', 'Lori', 'Rose', 'Katherine', 'Tiffany', 'Pamela', 'Anna', 'Crystal', 'Stephanie', 'Nicole', 'Amanda', 'Brittany', 'Melissa', 'Robin', 'Virginia', 'Maria', 'Catherine', 'Frances', 'Christine'],
    family: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes', 'Gonzales', 'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham', 'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West', 'Cole', 'Hayes', 'Bryant', 'Herrera', 'Gibson', 'Ellis', 'Tran', 'Medina', 'Aguilar', 'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall', 'Owens', 'Harrison']
  }
};

// More diverse names
const diverseNames = {
  male: {
    given: ['Ahmed', 'Chen', 'Raj', 'Diego', 'Kofi', 'Hiroshi', 'Dmitri', 'Giovanni', 'Hassan', 'Kwame', 'Lars', 'Pierre', 'Ravi', 'Sven', 'Tariq', 'Alejandro', 'Muhammad', 'Omar', 'Yuki', 'Kenji', 'Aarav', 'Arjun', 'Miguel', 'Carlos', 'Luis', 'Javier', 'Fernando', 'Rafael', 'Antonio', 'Marco', 'Angelo', 'Luca', 'Matteo', 'Alessandro', 'Roberto', 'Paolo', 'Fabio', 'Andrei', 'Nikolai', 'Viktor', 'Sergei', 'Ivan', 'Alexei', 'Boris', 'Mikhail', 'Vladislav', 'Maxim', 'Konstantin', 'Kirill', 'Artem', 'Denis', 'Anton', 'Oleg', 'Yuri', 'Daniil', 'Aleksandr', 'Kazuki', 'Takeshi', 'Yoshio', 'Akira', 'Satoshi', 'Masato', 'Takuya', 'Shingo', 'Kenta', 'Naoki', 'Ryota', 'Daichi', 'Yuto', 'Sota', 'Riku', 'Ren', 'Kai', 'Jun', 'Sho', 'Taro', 'Ichiro', 'Jiro', 'Saburo', 'Shiro', 'Goro', 'Rokuro', 'Shichiro', 'Hachiro', 'Kuro', 'Juro'],
    family: ['Patel', 'Zhang', 'Singh', 'Kim', 'Nguyen', 'Ali', 'Hassan', 'Kumar', 'Chen', 'Wu', 'Ahmed', 'Khan', 'Okafor', 'Andersson', 'Rossi', 'Gonzalez-Martinez', 'Fernandez', 'Rodriguez-Lopez', 'Morales', 'Ramirez', 'Castro', 'Vargas', 'Herrera', 'Mendoza', 'Jimenez', 'Romero', 'Gutierrez', 'Moreno', 'Ortega', 'Silva', 'Ruiz-Santos', 'Delgado', 'Aguilar', 'Vega', 'Molina', 'Contreras', 'Guerrero', 'Medina', 'Luna', 'Soto', 'Rios', 'Ramos', 'Franco', 'Ayala', 'Peña', 'Santana', 'Sandoval', 'Espinoza', 'Valencia', 'Galindo', 'Cortez', 'Dominguez', 'Carrillo', 'Flores-Rivera', 'Yamamoto', 'Tanaka', 'Watanabe', 'Ito', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Matsumoto', 'Inoue', 'Kimura', 'Shimizu', 'Suda', 'Hayashi', 'Yamazaki', 'Mori', 'Abe', 'Ikeda', 'Hashimoto', 'Ishikawa', 'Nakajima', 'Maeda', 'Ogawa', 'Okada', 'Hasegawa', 'Kondo', 'Ishii', 'Fukuda', 'Endo', 'Nishimura', 'Saito', 'Takahashi']
  },
  female: {
    given: ['Priya', 'Mei', 'Fatima', 'Sofia', 'Aisha', 'Yuki', 'Ingrid', 'Francesca', 'Zara', 'Amara', 'Ling', 'Noor', 'Kaia', 'Elena', 'Zoe', 'Isabella', 'Camila', 'Valentina', 'Lucia', 'Esperanza', 'Carmen', 'Rosa', 'Ana', 'Maria', 'Gabriela', 'Alejandra', 'Paola', 'Andrea', 'Daniela', 'Fernanda', 'Mariana', 'Natalia', 'Claudia', 'Adriana', 'Silvia', 'Veronica', 'Leticia', 'Beatriz', 'Gloria', 'Dolores', 'Concepcion', 'Esperanza', 'Mercedes', 'Soledad', 'Amparo', 'Pilar', 'Rosario', 'Remedios', 'Consuelo', 'Inmaculada', 'Montserrat', 'Nuria', 'Paloma', 'Rocio', 'Marisol', 'Estrella', 'Aurora', 'Luna', 'Cielo', 'Alma', 'Luz', 'Esperanza', 'Fe', 'Caridad', 'Milagros', 'Angeles', 'Sakura', 'Yuki', 'Akiko', 'Emiko', 'Keiko', 'Mariko', 'Noriko', 'Reiko', 'Sachiko', 'Takako', 'Yasuko', 'Yoshiko', 'Kumiko', 'Machiko', 'Naoko', 'Ryoko', 'Sayuri', 'Tomoko', 'Yoko', 'Yukiko', 'Chieko', 'Hanako', 'Haruko', 'Hideko', 'Hiroko', 'Junko', 'Kazuko', 'Kyoko', 'Masako', 'Michiko', 'Midori', 'Miyuki', 'Nobuko', 'Satoko', 'Shizuko', 'Sumiko', 'Teruko', 'Toshiko', 'Yuriko', 'Etsuko', 'Fumiko', 'Hisako', 'Ikuko', 'Kiyoko', 'Mitsuko', 'Shigeko', 'Taeko', 'Tamiko', 'Tsukiko', 'Wakako', 'Yumiko'],
    family: ['Patel', 'Zhang', 'Singh', 'Kim', 'Nguyen', 'Ali', 'Hassan', 'Kumar', 'Chen', 'Wu', 'Ahmed', 'Khan', 'Okafor', 'Andersson', 'Rossi', 'Gonzalez-Martinez', 'Fernandez', 'Rodriguez-Lopez', 'Morales', 'Ramirez', 'Castro', 'Vargas', 'Herrera', 'Mendoza', 'Jimenez', 'Romero', 'Gutierrez', 'Moreno', 'Ortega', 'Silva', 'Ruiz-Santos', 'Delgado', 'Aguilar', 'Vega', 'Molina', 'Contreras', 'Guerrero', 'Medina', 'Luna', 'Soto', 'Rios', 'Ramos', 'Franco', 'Ayala', 'Peña', 'Santana', 'Sandoval', 'Espinoza', 'Valencia', 'Galindo', 'Cortez', 'Dominguez', 'Carrillo', 'Flores-Rivera', 'Yamamoto', 'Tanaka', 'Watanabe', 'Ito', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Matsumoto', 'Inoue', 'Kimura', 'Shimizu', 'Suda', 'Hayashi', 'Yamazaki', 'Mori', 'Abe', 'Ikeda', 'Hashimoto', 'Ishikawa', 'Nakajima', 'Maeda', 'Ogawa', 'Okada', 'Hasegawa', 'Kondo', 'Ishii', 'Fukuda', 'Endo', 'Nishimura', 'Saito', 'Takahashi']
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
  const isUSName = Math.random() < 0.9; // 90% US names, 10% diverse
  
  const nameSource = isUSName ? usNames[gender] : diverseNames[gender];
  const firstName = getRandomElement(nameSource.given);
  const lastName = getRandomElement(nameSource.family);
  
  const patient = {
    resourceType: 'Patient',
    active: Math.random() > 0.03, // 3% chance of being inactive
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

// Track used appointment slots to prevent conflicts
const usedAppointmentSlots = new Set();

function generateAppointmentDate() {
  const today = new Date();
  const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  
  let appointmentDate;
  let attempts = 0;
  const maxAttempts = 1000; // Increased max attempts
  
  do {
    // Keep generating dates until we get a weekday (Monday-Friday)
    let dateAttempts = 0;
    do {
      const randomTime = today.getTime() + (Math.random() - 0.5) * 2 * oneMonth;
      appointmentDate = new Date(randomTime);
      dateAttempts++;
      
      // Safety check to prevent infinite loop
      if (dateAttempts > 100) break;
    } while (appointmentDate.getDay() === 0 || appointmentDate.getDay() === 6); // 0 = Sunday, 6 = Saturday
    
    // Set to business hours (9 AM - 5 PM)
    const hour = 9 + Math.floor(Math.random() * 8); // 9-16 (5 PM)
    const minute = Math.random() < 0.5 ? 0 : 30; // Either :00 or :30
    
    appointmentDate.setHours(hour, minute, 0, 0);
    
    // Create a unique slot identifier
    const slotKey = appointmentDate.toISOString();
    
    // Check if this slot is already taken
    if (!usedAppointmentSlots.has(slotKey)) {
      usedAppointmentSlots.add(slotKey);
      return appointmentDate;
    }
    
    attempts++;
  } while (attempts < maxAttempts);
  
  // If we couldn't find a unique slot, just return the last generated date
  // This is a fallback to prevent infinite loops
  console.warn('Could not find unique appointment slot, using potentially conflicting time');
  return appointmentDate;
}

function generateAppointment(patientReference, patientName) {
  const startDate = generateAppointmentDate();
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes later
  const today = new Date();
  
  const appointmentTypes = [
    { code: 'ROUTINE', display: 'Routine appointment - default if not valued' },
    { code: 'ROUTINE', display: 'Routine appointment - default if not valued' },
    { code: 'ROUTINE', display: 'Routine appointment - default if not valued' },
    { code: 'ROUTINE', display: 'Routine appointment - default if not valued' },
    { code: 'ROUTINE', display: 'Routine appointment - default if not valued' },
    { code: 'WALKIN', display: 'A previously unscheduled walk-in visit' },
    { code: 'CHECKUP', display: 'A routine check-up, such as an annual physical' },
    { code: 'CHECKUP', display: 'A routine check-up, such as an annual physical' },
    { code: 'CHECKUP', display: 'A routine check-up, such as an annual physical' },
    { code: 'CHECKUP', display: 'A routine check-up, such as an annual physical' },
    { code: 'CHECKUP', display: 'A routine check-up, such as an annual physical' },
    { code: 'CHECKUP', display: 'A routine check-up, such as an annual physical' },
    { code: 'FOLLOWUP', display: 'A follow up visit from a previous appointment' },
    { code: 'FOLLOWUP', display: 'A follow up visit from a previous appointment' },
    { code: 'FOLLOWUP', display: 'A follow up visit from a previous appointment' },
    { code: 'FOLLOWUP', display: 'A follow up visit from a previous appointment' },
    { code: 'FOLLOWUP', display: 'A follow up visit from a previous appointment' },
    { code: 'FOLLOWUP', display: 'A follow up visit from a previous appointment' },
    { code: 'FOLLOWUP', display: 'A follow up visit from a previous appointment' },
    { code: 'FOLLOWUP', display: 'A follow up visit from a previous appointment' },
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
  
  // Clear any previously used appointment slots
  usedAppointmentSlots.clear();
  
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
