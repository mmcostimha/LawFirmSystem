import {useState} from 'react';

export default function AlarmForm() {
    const [formData, setFormData] = useState({
        email: '',
        provider: '',
        type: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit} >
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="provider">Provedor:</label>
                <input
                    type="text"
                    id="provider"
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="type">Tipo:</label>
                <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Enviar</button>
        </form>
    );
}