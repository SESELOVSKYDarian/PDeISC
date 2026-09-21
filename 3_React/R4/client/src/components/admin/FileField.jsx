import { useState } from 'react'
import { FileText, ImageOff, Upload, X } from 'lucide-react'
import { api } from '../../services/api.js'
import { checkFile, fileRules } from '../../utils/fileRules.js'

// campo para subir una imagen o un PDF desde la computadora; guarda en el formulario la dirección del archivo
export function FileField({ field, value, onChange }) {
  const rule = fileRules[field.type]
  const [state, setState] = useState({ busy: false, error: '' })

  const pick = async (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return

    const problem = checkFile(file, field.type)
    if (problem) return setState({ busy: false, error: problem })

    setState({ busy: true, error: '' })
    try {
      const { url } = await api.upload(field.type, file)
      onChange(field.name, url)
      setState({ busy: false, error: '' })
    } catch (error) {
      setState({ busy: false, error: error.message })
    }
  }

  return (
    <div className={`field file-field ${state.error ? 'has-error' : ''}`}>
      <span>{field.label}{rule.required ? '' : ' (opcional)'}</span>
      <div className="file-box">
        <FilePreview kind={field.type} value={value} />
        <div className="file-actions">
          <label className="button button-ghost button-small file-pick">
            <Upload aria-hidden="true" /> {state.busy ? 'Subiendo…' : value ? 'Cambiar archivo' : rule.pickLabel}
            <input type="file" accept={rule.accept} onChange={pick} disabled={state.busy} />
          </label>
          {!rule.required && value ? <button type="button" className="button button-ghost button-small" onClick={() => onChange(field.name, '')}><X aria-hidden="true" /> Quitar</button> : null}
          <p className="file-hint">{rule.hint}</p>
        </div>
      </div>
      {state.error ? <small role="alert">{state.error}</small> : null}
    </div>
  )
}

function FilePreview({ kind, value }) {
  if (kind === 'cv') {
    return value
      ? <a className="file-preview file-preview-doc" href={value} target="_blank" rel="noreferrer"><FileText aria-hidden="true" /> Ver PDF actual</a>
      : <div className="file-preview file-preview-empty"><FileText aria-hidden="true" /> Sin archivo</div>
  }
  return value
    ? <img className={`file-preview file-preview-${kind}`} src={value} alt="Vista previa de la imagen actual" />
    : <div className="file-preview file-preview-empty"><ImageOff aria-hidden="true" /> Sin imagen</div>
}
