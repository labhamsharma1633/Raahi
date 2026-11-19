import React from 'react';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  helperText,
  error,
  icon: Icon,
  rows,
  options = [],
  suffix,
  className = ''
}) {
  const isTextarea = type === 'textarea';
  const isSelect = type === 'select';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-xs font-bold text-slate-700 tracking-tight"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4 text-slate-500" />
          </div>
        )}

        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows || 3}
            required={required}
            className={`w-full rounded-xl border bg-white text-slate-900 text-sm placeholder:text-slate-400 p-3 ${
              Icon ? 'pl-10' : ''
            } ${
              error 
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 focus:border-rose-500' 
                : 'border-slate-200 focus:ring-2 focus:ring-teal-200 focus:border-raahi-teal'
            } transition-all outline-none resize-none`}
          />
        ) : isSelect ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full rounded-xl border bg-white text-slate-900 text-sm p-3 appearance-none ${
              Icon ? 'pl-10' : ''
            } ${
              error 
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 focus:border-rose-500' 
                : 'border-slate-200 focus:ring-2 focus:ring-teal-200 focus:border-raahi-teal'
            } transition-all outline-none pr-8 cursor-pointer`}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((opt, idx) => (
              <option key={idx} value={typeof opt === 'string' ? opt : opt.value}>
                {typeof opt === 'string' ? opt : opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full rounded-xl border bg-white text-slate-900 text-sm placeholder:text-slate-400 p-3 ${
              Icon ? 'pl-10' : ''
            } ${suffix ? 'pr-12' : ''} ${
              error 
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 focus:border-rose-500' 
                : 'border-slate-200 focus:ring-2 focus:ring-teal-200 focus:border-raahi-teal'
            } transition-all outline-none`}
          />
        )}

        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-semibold text-slate-500">
            {suffix}
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="text-[11px] text-slate-500 leading-normal">{helperText}</p>
      )}

      {error && (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
}
