// logica para el registro de pacientes medicore
// maneja la edad, el mail compuesto y el localstorage para el listado de pacientes
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('patientForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = form.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    const patientTableBody = document.getElementById('patientTableBody');
    const totalItemsBadge = document.getElementById('totalItems');
    const toastContainer = document.getElementById('toast-container');
    
    // cosas para la edad y los hijos
    const birthDateInput = document.getElementById('fechaNacimiento');
    const ageInput = document.getElementById('edad');
    const underageAlert = document.getElementById('underageAlert');
    const hijosContainer = document.getElementById('hijosContainer');
    const tieneHijosRadios = document.getElementsByName('tieneHijos');

    // cosas para el dni/tramite
    const tipoDocumento = document.getElementById('tipo_documento');
    const tramiteGroup = document.getElementById('tramiteGroup');
    const tramiteInput = document.getElementById('tramite');

    tipoDocumento.addEventListener('change', (e) => {
        if (e.target.value === 'Documento Extranjero') {
            tramiteGroup.style.display = 'none';
            tramiteInput.removeAttribute('required');
        } else {
            tramiteGroup.style.display = 'flex';
            tramiteInput.setAttribute('required', 'true');
        }
    });

    tramiteInput.addEventListener('blur', () => {
        let val = tramiteInput.value.trim();
        if (val && val.length < 11 && /^\d+$/.test(val)) {
            tramiteInput.value = val.padStart(11, '0');
            // validamos visualmente despues de rellenar con ceros
            window.appValidations.validateField(tramiteInput);
        }
    });

    // mostramos los toasts
    const showToast = (msg, type = 'success') => {
        const toast = document.createElement('div');
        const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-octagon-fill';
        toast.innerHTML = `<i class="bi ${iconClass}"></i> <span>${msg}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    // mostramos la tabla con lo que hay en localstorage
    const renderTable = () => {
        const stored = localStorage.getItem('pacientes_data');
        const patients = stored ? JSON.parse(stored) : [];
        patientTableBody.innerHTML = '';
        
        if (patients.length === 0) {
            patientTableBody.innerHTML = '<tr id="emptyRow"><td colspan="3" class="empty-cell">Sin registros en sesión.</td></tr>';
            totalItemsBadge.textContent = '0 pacientes';
            return;
        }

        totalItemsBadge.textContent = `${patients.length} paciente${patients.length !== 1 ? 's' : ''}`;

        patients.forEach(p => {
            const tr = document.createElement('tr');
            const nombreCompleto = `${p.nombre || ''} ${p.apellido || ''}`.trim();
            tr.innerHTML = `
                <td><strong>${nombreCompleto}</strong></td>
                <td>${p.edad ?? '—'} años</td>
                <td><span class="badge" style="background:#0ea5e9">${p.obraSocial}</span></td>
            `;
            patientTableBody.appendChild(tr);
        });
    };

    renderTable();

    // validamos mientras escriben o cuando salen del campo
    const allInputs = form.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            window.appValidations.validateField(input);
        });
        input.addEventListener('blur', () => {
            window.appValidations.validateField(input);
        });
    });

    // mostramos el campo de cuantos hijos tiene si marca que si
    tieneHijosRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Sí') {
                hijosContainer.style.display = 'flex';
                document.getElementById('cantidadHijos').setAttribute('required', 'true');
            } else {
                hijosContainer.style.display = 'none';
                document.getElementById('cantidadHijos').removeAttribute('required');
                document.getElementById('cantidadHijos').value = '';
            }
        });
    });

    // calculamos la edad solo cuando pone la fecha de nacimiento
    birthDateInput.addEventListener('change', (e) => {
        const age = window.appValidations.calculateAge(e.target.value);
        if (age !== null) {
            ageInput.value = age;
            window.appValidations.validateField(ageInput);
            
            // avisamos si es menor de edad
            if (age < 18 && age >= 0) {
                underageAlert.style.display = 'block';
            } else {
                underageAlert.style.display = 'none';
            }
        }
    });

    // aca mandamos el formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // primero nos fijamos si el tramite o el mail ya existen aca mismo
        const stored = localStorage.getItem('pacientes_data');
        const patients = stored ? JSON.parse(stored) : [];
        
        const currentTramite = document.getElementById('tramite').value.trim();
        const emailUser = document.getElementById('emailUser').value.trim();
        const emailDomain = document.getElementById('emailDomain').value.trim();
        const emailTld = document.getElementById('emailTld').value;
        const currentEmail = `${emailUser}@${emailDomain}${emailTld}`;

        const isTramiteDuplicated = patients.some(p => p.tramite === currentTramite);
        const isEmailDuplicated = patients.some(p => p.email === currentEmail);

        if (currentTramite && isTramiteDuplicated) {
            showToast('Error: El número de trámite ya está registrado.', 'error');
            document.getElementById('tramite').closest('.form-group').classList.add('is-invalid');
            return;
        }
        if (isEmailDuplicated) {
            showToast('Error: El Email ya está registrado.', 'error');
            document.getElementById('emailUser').closest('.form-group').classList.add('is-invalid');
            return;
        }

        // validamos todo el form antes de seguir
        let isFormValid = true;
        allInputs.forEach(input => {
            if (!window.appValidations.validateField(input)) isFormValid = false;
        });

        if (!isFormValid || !form.checkValidity()) {
            showToast('Por favor, corrija los errores en el formulario.', 'error');
            return;
        }

        // preparamos los datos para mandar
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.email = currentEmail; // metemos el mail armado

        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        try {
            const response = await fetch('/api/pacientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error al registrar el paciente.');
            }

            // si sale bien guardamos en localstorage y reseteamos el form
            patients.push(result.paciente);
            localStorage.setItem('pacientes_data', JSON.stringify(patients));
            
            showToast('¡Paciente registrado con éxito!', 'success');
            form.reset();
            
            // sacamos los bordes verdes y rojos
            allInputs.forEach(input => {
                const group = input.closest('.form-group');
                if (group) group.classList.remove('is-valid', 'is-invalid');
            });
            underageAlert.style.display = 'none';
            hijosContainer.style.display = 'none';
            
            renderTable();

        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    });
});
