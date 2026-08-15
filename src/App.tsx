import { useEffect, useState } from 'react';
import './App.css';
import {
  fetchStationDepartures,
  fetchVehicleData,
  type LiveboardDeparture,
  type VehicleResponse,
} from './services/irail';

const DEFAULT_STATION = 'Brussels-South';
const STATION_OPTIONS = [
  'Brussels-South',
  'Brussels-Central',
  'Ghent-Sint-Pieters',
  'Antwerp-Central',
  'Liege-Guillemins',
];
const SERVICE_OPTIONS = ['Todos', 'IC', 'S', 'P', 'L'];

function App() {
  const [data, setData] = useState<VehicleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchingTrains, setSearchingTrains] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [station, setStation] = useState(DEFAULT_STATION);
  const [trainOptions, setTrainOptions] = useState<LiveboardDeparture[]>([]);
  const [selectedTrainId, setSelectedTrainId] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('Todos');

  const loadData = async (vehicleId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchVehicleData(vehicleId);
      setData(result);
      setSelectedTrainId(vehicleId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ha ocurrido un error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const searchTrains = async (stationName = station) => {
    try {
      setSearchingTrains(true);
      setError(null);
      const departures = await fetchStationDepartures(stationName);
      setTrainOptions(departures);

      const filteredTrain = departures.find((departure) => {
        if (!departure.vehicle) return false;
        if (selectedService === 'Todos') return true;

        const type = departure.vehicleinfo?.type?.toUpperCase() ?? '';
        return type === selectedService;
      });

      if (filteredTrain?.vehicle) {
        await loadData(filteredTrain.vehicle);
      } else {
        setData(null);
        setSelectedTrainId('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los trenes');
      setTrainOptions([]);
      setData(null);
      setSelectedTrainId('');
    } finally {
      setSearchingTrains(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void searchTrains(DEFAULT_STATION);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleStationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedStation = station.trim();
    if (!normalizedStation) {
      setError('Introduce una estación válida.');
      return;
    }

    await searchTrains(normalizedStation);
  };

  return (
    <main className="app-shell">
      <section className="card">
        <h1>iRail vehicle data</h1>

        <form onSubmit={handleStationSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <select
            value={station}
            onChange={(event) => setStation(event.target.value)}
            aria-label="Estación"
            style={{ flex: 1, minWidth: '220px', padding: '0.7rem' }}
          >
            {STATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button type="submit" disabled={searchingTrains} style={{ padding: '0.7rem 1rem' }}>
            {searchingTrains ? 'Buscando...' : 'Buscar estación'}
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {SERVICE_OPTIONS.map((service) => (
            <button
              key={service}
              type="button"
              onClick={() => setSelectedService(service)}
              style={{
                padding: '0.45rem 0.8rem',
                border: 'none',
                borderRadius: '999px',
                background: selectedService === service ? '#1f6feb' : '#e5e7eb',
                color: selectedService === service ? '#fff' : '#111',
                cursor: 'pointer',
              }}
            >
              {service}
            </button>
          ))}
        </div>

        {trainOptions.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <strong>Trenes disponibles</strong>
            <div className="table-wrapper" style={{ marginTop: '0.75rem' }}>
              <table className="stop-table">
                <thead>
                  <tr>
                    <th>Tren</th>
                    <th>Hora</th>
                    <th>Plataforma</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {trainOptions
                    .filter((train) => {
                      if (selectedService === 'Todos') return true;
                      const type = train.vehicleinfo?.type?.toUpperCase() ?? '';
                      return type === selectedService;
                    })
                    .slice(0, 10)
                    .map((train, index) => {
                      const vehicleId = train.vehicle ?? `tren-${index}`;
                      const label = train.vehicleinfo?.shortname ?? train.vehicle ?? vehicleId;
                      const timeValue = train.time ? new Date(Number(train.time) * 1000) : null;

                      return (
                        <tr key={vehicleId}>
                          <td>{label}</td>
                          <td>
                            {timeValue
                              ? timeValue.toLocaleTimeString('en-GB', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'N/D'}
                          </td>
                          <td>{train.platform || 'N/D'}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => void loadData(vehicleId)}
                              style={{
                                padding: '0.35rem 0.7rem',
                                background: selectedTrainId === vehicleId ? '#1f6feb' : '#eee',
                                color: selectedTrainId === vehicleId ? '#fff' : '#111',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p>Consulta del tren: {data?.vehicle ?? selectedTrainId ?? 'Sin selección'}</p>

        {loading && <p>Cargando información del tren...</p>}
        {error && <p className="error">{error}</p>}

        {data && (
          <>
            <div className="summary">
              <div>
                <strong>Nombre</strong>
                <p>{data.vehicleinfo.shortname}</p>
              </div>
              <div>
                <strong>Tipo</strong>
                <p>{data.vehicleinfo.type}</p>
              </div>
              <div>
                <strong>Número</strong>
                <p>{data.vehicleinfo.number}</p>
              </div>
            </div>

            <h2>Paradas</h2>
            <div className="table-wrapper">
              <table className="stop-table">
                <thead>
                  <tr>
                    <th>Estación</th>
                    <th>Plataforma</th>
                    <th>Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {data.stops.stop.map((stop) => (
                    <tr key={stop.id}>
                      <td>{stop.stationinfo?.name ?? stop.station}</td>
                      <td>{stop.platform || 'N/D'}</td>
                      <td>
                        {new Date(Number(stop.time) * 1000).toLocaleString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default App;
