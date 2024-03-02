import axios from 'axios';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css'; 
import cpu from '../public/CPU.png';
import miau from '../public/MIAU.png';
// Conexión al servidor de sockets
const socket = io('http://localhost:5555');

interface Worker {
  id: string;
  job: string;
  name: string;
}

interface AffiliationData {
  id: string;
  worker: Worker[];
  _id: string;
}

function App() {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [affiliationData, setAffiliationData] = useState<AffiliationData | null>(null);


  useEffect(() => {
    // Escucha el evento 'newAffiliation' cuando el componente se monta
    socket.on('newAffiliation', (data) => {
      console.log('Nueva afiliación recibida:', data);
      // Actualiza el estado con los datos de la afiliación
      setAffiliationData(data);
    });

    // Limpieza al desmontar el componente
    return () => {
      socket.off('newAffiliation');
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post('http://localhost:7771/workers/create', {
      name,
      job,
    }).then((response) => {
      console.log('Respuesta del servidor:', response.data);
      // Opcional: Limpia el formulario después de enviar
      setName('');
      setJob('');
    });
  };

  return (
    <div className="app-container">
      <div className="header-container">
        <h1>Sistema de Afiliación Del CPU</h1>
        <h2>CAT PROGRAMMER UNION</h2>
      </div>
      <div className="content-container">
        <div className="form-container">
          <img src={miau} alt="Logo MIAU" style={{ maxWidth: '100px', margin: '0 auto' }}/>
          <form onSubmit={handleSubmit}>
            <h3>Trámite para afiliar al trabajador al MIAU</h3>
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="job">Puesto:</label>
              <select id="job" value={job} onChange={(e) => setJob(e.target.value)}>
                <option value="">Seleccione...</option>
                <option value="Ingeniero">Ingeniero</option>
                <option value="Arquitecto">Arquitecto</option>
                <option value="Programador">Programador</option>
              </select>
            </div>
            <button type="submit">Afiliar</button>
          </form>
        </div>
        <div className="data-container">
          {affiliationData && affiliationData.worker.length > 0 ? (
            <div>
     <h2>Bienvenido a CPU - Cat Programmer Union</h2>
      <img src={cpu} alt="Logo CPU" style={{ maxWidth: '280px', margin: '20px auto' }}/>
      <p>Felicidades, la afiliación ha sido exitosa. Ahora eres parte de nuestra comunidad.</p>
      <h3>Trabajador Afiliado</h3>
      <p><strong>ID:</strong> {affiliationData.worker[0].id}</p>
      <p><strong>Nombre:</strong> {affiliationData.worker[0].name}</p>
      <p><strong>Puesto:</strong> {affiliationData.worker[0].job}</p>
              <div className='texto-pequeno'>
              "El presente documento y la información contenida son confidenciales y propiedad exclusiva del MIAU (Movimiento Integral de Asistencia y Unidad Felina). La divulgación, copia, distribución, o cualquier otra acción relacionada con el contenido de este documento, sin la autorización explícita del MIAU, está estrictamente prohibida y puede ser ilegal. Este documento tiene como único propósito brindar información relevante y no debe ser considerado como un compromiso legal o contractual por parte del MIAU. Los detalles y especificaciones mencionados están sujetos a cambios sin previo aviso en función de las actualizaciones de políticas y procedimientos del MIAU."
              </div>
            </div>
          ) : (
            <p>No hay datos de afiliación aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
