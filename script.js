//DEFINIAMO UN OGGETTO ESTERNO ALLA FUNZIONE formValidation IN MODO DA POTERVI ACCEDERE
//IN QUALSIASI FUNZIONE CHE DEFINIAMO ALL'INTERNO DI QUESTO MODULO
const _v = {
  hasError: false,
  // NEL CASO IN CUI LA PASSWORD SIA VALIDA BISOGNA PORTARE A true isValidPassword
  // _v.isValidPassword = isValid.isLow || isValid.ishigh ? true : false;
  isValidPassword: false,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/,
};

/*********************************VALIDA FORM **************************************/
function formValidation(form, notifica) {
  //RECUPERIAMO L'ELEMENTO FORM
  _v.form = document.querySelector(`${form}`);
  //RECUPERIAMO L'OGGETTO DI NOTIFICA
  _v.notifica = document.querySelector(`${notifica}`);
  //RECUPERIAMO GLI ELEMENTI span
  _v.pwdpwdStrengthColor = document.querySelectorAll(
    'div.password-block > span'
  );
  //RECUPERIAMO TUTTI GLI ELEMENTI INPUT ALL'INTERNO DEL FORM
  ///PER TRASFORMARE UN html collection IN ARRAY USO Array.from */
  _v.formItems = Array.from(_v.form.elements);
  // elements = RITORNA HTML collection
  // DOBBIAMO COSTRUIRE IL CLICK SUL PULSANTE DI REGISTRAZIONE E INSERIMENTO PASSWORD
  submitForm();
  checkPasswordStrength();
}

/*********************************INVIA FORM **************************************/
function submitForm() {
  //DEVO IMPOSTARE UN EVENTO DI CLICK SUL BOTTONE
  _v.form.addEventListener(
    'submit',
    (e) => {
      //ANDIAMO A BLOCCARE LA PROPAGAZIONE DELL'EVENTO NEL DOM
      e.stopPropagation();
      //ANDIAMO A BLOCCARE IL COMPORTAMENTO DI DEFAULT QUANDO CLICCHIAMO SU UN input TIPO submit
      /**ANDRA' AGGIUNTO SULLA LINEA DEL FORM "novalidate" */
      e.preventDefault();
      //ANDIAMO A COSTRUIRE IL COMPLETAMENTO/CONTROLLO DEI CAMPI OBBLIGATORI
      if (checkValidation()) {
        _v.form.submit.classList.add('button-enable');
      }
    },
    true
  );
}
/****************CREIAMO FUNZIONI DI CONTROLLO CAMPI E RESET FORM******************/
function checkValidation() {
  // IMPOSTIAMO UN try / catch PER CATTUARE UN'EVENTUALE ERRORE
  try {
    //Controllo il completamento dei campi obbligatori (funzione)
    requiredFields();
    //Controllo correttezza email (funzione)
    isValidEmail();
    //Controllo validità password e corrispondenza con conferma (funzione)
    checkPassword();
    // NEL CASO IN CUI VIENE ESEGUITO IL CODICE DEL try DOPO L'NVOCAZIONE DELLE 3 function
    // SIGNIFICA KE NON CI SONO ERRORI, QUINDI LO ANDIAMO A SEGNALARE ALL'INTERNO DEL div
    // DI NOTIFICA
    //Controlli superati, notifica e invio il form
    _v.notifica.className = 'notification-success';
    _v.notifica.textContent = 'I dati sono stati inviati con successo';
    // DOBBIAMO RINIZIALIZZARE (RESET) IL FORM
    resetForm();
    // ALTRIMENTI SE SONO SOLLEVATE DELLE ECCEZIONI LO ANDIAMO A SEGNALARE NEL cath
  } catch (error) {
    _v.notifica.className = 'notification-error';
    _v.notifica.textContent = error.message;
  }
}
/*********************************CONTROLLO CAMPI**************************************/
function requiredFields() {
  let error;
  _v.hasError = false;
  //ITERIAMO TUTTI GLI ELEMENTI DEL form
  _v.formItems.forEach((element) => {
    //PER OGNI ELEMENTO DEL FORM INIZIALIZZIAMO error = false
    error = false;
    if (
      element.type !== 'checkbox' &&
      element.required &&
      element.velue === ''
    ) {
      //PORTIAMO error A true
      error = true;
    }
    if (element.type === 'checkbox' && element.required && !element.checked) {
      //PORTIAMO error A true
      error = true;
    }
    //SI ANDRANNO AD EVIDENZIARE LINEE ROSSE SE I CAMPI NON SONO TUTTI COMPILATI
    if (error) {
      _v.hasError = true;
      element.classList.add('error');
    }
  });
  // SOLLEVIAMO UN'ECCEZIONE
  if (_v.hasError) {
    throw new Error('Compilare i campi obbligatori');
  }
}
/*********************************CHECK EMAIL**************************************/
function isValidEmail() {
  if (!emailPattern.test(_v.form.email.value)) {
    //SOLLEVO UN'ECCEZIONE
    throw new Error('Email indicata non valida');
  }
}

/*********************************CHECK PASSWORD**************************************/
function checkPassword() {
  //MI VADO A PRENDERE IL VALORE DELLA PASSWORD
  const password = _v.form.password.value;
  //MI VADO A PRENDERE IL VALORE DELLA CONFERMA PASSWORD
  let confermaPassword = _v.form.re_password.value;
  // SOLLEVIAMO UN'ECCEZIONE
  if (!isValidPassword) {
    throw new Error('Password indicata non valida');
  }
  // SOLLEVIAMO UN'ECCEZIONE
  if (password !== confermaPassword) {
    throw new Error('Password e Conferma Password non coincidono');
  }
}
function registerEventHandlers() {
  _v.form.password.addEventListener('keyup', (e) => checkPasswordStrength(e));
  _v.form.re_password.addEventListener('keyup', (e) =>
    checkPasswordStrength(e)
  );
}

/* ****************DETTAGLIO SICUREZZA PASSWORD*************************
 * password valida ma non sicura (attivazione rosso): almeno 8 caratteri
 * password mediamente sicura (attivazione arancione): almeno 8 caratteri,
 *  con almeno un carattere speciale
 * password molto sicura (attivazione verde): almeno 10 caratteri, con due
 * caratteri speciali e almeno una lettera in maiuscolo
 */

/*******************************CHECK PASSWORD STRENGTH********************************/
function checkPasswordStrength(e) {
  //VADO AD AGGIUNGERE UN event listener SUL CAMPO password
  // _v.form.password.addEventListener('keyup', (e) => {
  //DEFINIAMO UN OGGETTO isValid
  const isValid = {
      low: false, // SE LA PASSWORD è VALIDA MA POCO SICURA ASSEGNO POI true
      isHigh: false, // SE LA PASSWORD è SICURA ASSEGNO POI true
    },
    //ANDIAMO A PRENDERCI IL VALORE DELLA PASSWORD
    password = e.target.value;
  //ANDIAMO A TOGLIERE LA CLASSE active SUGLI span (verrà fatta con una funzione)
  resetPasswordStrength();
  //password valida ma non sicura (attivazione rosso): almeno 8 caratteri
  if (password.length >= 8) {
    //ATTIVO IL PRIMO span
    _v.pwdpwdStrengthColor[0].classList.add('active');
    //password mediamente sicura (attivazione arancione): almeno 8 caratteri,
    //con almeno un carattere speciale (CREO FUNZIONE PER CARATTERI SPECIALI)
    if (regexCount(/[&@?!%]/g, password) === 1) {
      //ATTIVO IL SECONDO span
      _v.pwdpwdStrengthColor[1].classList.add('active');
    }
    isValid.low = true;
  }
  //password molto sicura (attivazione verde): almeno 10 caratteri, con due
  //caratteri speciali e almeno una lettera in maiuscolo
  if (password.length >= 10 && regexCount(/[&@?!%]/g, password) === 2) {
    //ATTIVO TUTTI GLI span
    _v.pwdpwdStrengthColor.forEach((item) => {
      item.classList.add('active');
    });
    isValid.isHigh = true;
  }
  isValidPassword = isValid.low || isValid.isHigh ? true : false;
  // });
}
/*************************CHECK CARATTERI SPECIALI*******************************/
// VOGLAIMO CHE SE CONTIENE UN CARATTERE SPECIALE ATTIVIAMO SECONDA LINEA
// ANDIAMO A CONTROLLARE QUANTE OCCORRENZE CI SONO DENTRO LA PASSWORD
function regexCount(pattern, password) {
  // RITORNA UN ARRAY CON LE CORRISPONDENZE TROVATE, SE NON TROVA NULLA []
  return (password.match(pattern) || []).length;
}

/******************************RESET FORM E LA CLASSE error**************************/
function resetForm() {
  _v.form.reset();
  resetPasswordStrength();
  _v.form.forEach((item) => {
    item.classList.remove('error');
  });
}
/*************************RESET ELEMENTI span (PASSWORD)**************************/
function resetPasswordStrength() {
  _v.pwdpwdStrengthColor.forEach((span) => {
    span.classList.remove('active');
  });
}
setTimeout(() => {
  _v.form = document.querySelector(`#form-registrazione`);
  _v.pwdpwdStrengthColor = document.querySelectorAll(
    'div.password-block > span'
  );
  registerEventHandlers();
}, 1000);

// export default formValidation;
