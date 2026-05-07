// logica para el registro de socios de river
// maneja el modal, validaciones, el mail compuesto y guardar todo en la tabla
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('socioForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = form.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    const tableBody = document.getElementById('inventoryTableBody');
    const totalItemsBadge = document.getElementById('totalItems');
    const toastContainer = document.getElementById('toast-container');

    // cosas para el telefono
    const phoneCountry = document.getElementById('phoneCountry');
    const argMobilePrefix = document.getElementById('argMobilePrefix');

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
        }
    });
    
    // reglas de la contraseña
    const passwordInput = document.getElementById('password');
    const rules = {
        length: document.getElementById('rule-length'),
        upper: document.getElementById('rule-upper'),
        lower: document.getElementById('rule-lower'),
        number: document.getElementById('rule-number'),
        special: document.getElementById('rule-special')
    };

    // el modal de los terminos y condiciones
    const openTermsModal = document.getElementById('openTermsModal');
    const termsModal = document.getElementById('termsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const termsBody = document.getElementById('termsBody');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    const termsCheckbox = document.getElementById('termsCheckbox');

    // aca abrimos y cerramos el modal
    openTermsModal.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // trabamos el scroll del fondo
    });

    const closeTerms = () => {
        termsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    closeModalBtn.addEventListener('click', closeTerms);
    
    // si tocan afuera tambien se cierra
    window.addEventListener('click', (e) => {
        if (e.target === termsModal) closeTerms();
    });

    // habilitamos el check cuando llegan al final del texto
    termsBody.addEventListener('scroll', () => {
        // dejamos un margen de 5px para que no sea tan exacto
        const isAtBottom = termsBody.scrollHeight - termsBody.scrollTop <= termsBody.clientHeight + 5;
        if (isAtBottom) {
            termsCheckbox.disabled = false;
            termsCheckbox.checked = true;
            scrollDownBtn.innerHTML = '<i class="bi bi-check-all"></i> Términos leídos y aceptados';
            scrollDownBtn.style.background = 'var(--success)';
        }
    });

    // boton para ir abajo de todo rapido
    scrollDownBtn.addEventListener('click', () => {
        termsBody.scrollTo({
            top: termsBody.scrollHeight,
            behavior: 'smooth'
        });
        // El listener de scroll se encargará de habilitar el check
    });

    // notificaciones tipo toast
    const showToast = (msg, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
        toast.innerHTML = `<i class="bi ${iconClass}"></i> <span>${msg}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };

    // ponemos bordes rojos si escriben mal
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const inputs = group.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (!input.checkValidity()) {
                    group.classList.add('invalid');
                } else {
                    group.classList.remove('invalid');
                }
            });
        });
    });

    // si eligen argentina mostramos el prefijo 9
    phoneCountry.addEventListener('change', (e) => {
        if (e.target.value === '+54') {
            argMobilePrefix.style.display = 'flex';
        } else {
            argMobilePrefix.style.display = 'none';
        }
    });

    // validamos la clave mientras escriben
    passwordInput.addEventListener('input', (e) => {
        const val = e.target.value;
        
        // minimo 12 letras
        if (val.length >= 12) rules.length.classList.add('valid');
        else rules.length.classList.remove('valid');

        // Uppercase
        if (/[A-Z]/.test(val)) rules.upper.classList.add('valid');
        else rules.upper.classList.remove('valid');

        // Lowercase
        if (/[a-z]/.test(val)) rules.lower.classList.add('valid');
        else rules.lower.classList.remove('valid');

        // algun numerito tiene que tener
        if (/\d/.test(val)) rules.number.classList.add('valid');
        else rules.number.classList.remove('valid');

        // algun caracter raro tambien
        if (/[.!\@#\$%\^&\*\(\)\-\+\?]/.test(val)) rules.special.classList.add('valid');
        else rules.special.classList.remove('valid');
    });

    // mostramos los datos en la tabla
    const renderTable = () => {
        const items = window.inventoryStorage.getAllItems();
        tableBody.innerHTML = '';
        
        if (items.length === 0) {
            tableBody.innerHTML = '<tr id="emptyRow"><td colspan="4" class="empty-cell">Nadie se ha asociado en esta sesión todavía.</td></tr>';
            totalItemsBadge.textContent = '0 socios';
            return;
        }

        totalItemsBadge.textContent = `${items.length} socio${items.length !== 1 ? 's' : ''}`;

        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.documento}</strong></td>
                <td>${item.sexo}</td>
                <td>${item.nacionalidad}</td>
                <td>${item.email}</td>
            `;
            tableBody.appendChild(tr);
        });
    };

    renderTable();

    // aca mandamos el form al server
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            showToast('Por favor, revisa los campos en rojo.', 'error');
            // marcamos los que esten mal
            form.querySelectorAll('input, select').forEach(input => {
                if (!input.checkValidity()) {
                    const group = input.closest('.form-group');
                    if(group) group.classList.add('invalid');
                }
            });
            return;
        }

        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // armamos el mail entero
        data.email = `${data.emailUser}@${data.emailDomain}${data.emailTld}`;
        delete data.emailUser;
        delete data.emailDomain;
        delete data.emailTld;

        // armamos el telefono entero segun el pais
        let fullPhone = data.phoneCountry;
        if (data.phoneCountry === '+54') {
            fullPhone += '9'; // agregamos el 9 para argentina
        }
        fullPhone += data.phoneArea + data.phoneNumber;
        data.telefono = fullPhone;
        
        delete data.phoneCountry;
        delete data.phoneArea;
        delete data.phoneNumber;

        try {
            const response = await fetch('/api/socios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error desconocido.');
            }

            showToast(result.message, 'success');
            
            // guardamos segun el metodo que eligieron (push o unshift)
            window.inventoryStorage.saveItem(result.socio, data.metodo_almacenaje);
            
            renderTable();
            form.reset();
            
            // limpiamos los checks de la clave y el form
            Object.values(rules).forEach(el => el.classList.remove('valid'));
            argMobilePrefix.style.display = 'flex'; // volvemos a poner argentina por defecto

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
