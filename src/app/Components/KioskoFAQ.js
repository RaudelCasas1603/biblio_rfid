export default function KioskoFAQ() {
  const faqs = [
    {
      pregunta: "¿Qué es el kiosko BiblioRFID?",
      respuesta:
        "Es una herramienta digital que permite consultar, solicitar, devolver y renovar libros de forma autónoma usando tecnología RFID.",
    },
    {
      pregunta: "¿Cómo solicito un libro desde el kiosko?",
      respuesta:
        "Inicia sesión con tu matrícula o escanea tu credencial. Luego busca el libro deseado y haz clic en 'Solicitar libro'.",
    },
    {
      pregunta: "¿Puedo ver mis préstamos activos desde el kiosko?",
      respuesta:
        "Sí. Al iniciar sesión verás una lista de tus libros prestados, su fecha de vencimiento y la opción para renovarlos.",
    },
    {
      pregunta: "¿Qué pasa si no devuelvo un libro a tiempo?",
      respuesta:
        "El sistema lo marcará como vencido y podrías recibir restricciones para nuevos préstamos, según las reglas de la biblioteca.",
    },
    {
      pregunta: "¿Qué significa el contador junto al libro?",
      respuesta:
        "Es una cuenta regresiva que indica cuántos días te quedan antes de la fecha de devolución del préstamo.",
    },
    {
      pregunta: "¿Cómo sé si un libro está disponible?",
      respuesta:
        "Cada libro muestra el número de copias disponibles. Si no hay, puedes unirte a una lista de espera.",
    },
    {
      pregunta: "¿Cómo devuelvo un libro?",
      respuesta:
        "Coloca el libro en el lector RFID del kiosko o punto de devolución para que se registre automáticamente como devuelto.",
    },
    {
      pregunta: "¿Puedo hacer reservas anticipadas?",
      respuesta:
        "Sí. Si el libro está ocupado, puedes reservarlo desde el kiosko y recibirás una notificación cuando esté disponible.",
    },
    {
      pregunta: "¿Dónde veo recomendaciones de libros?",
      respuesta:
        "En la sección 'Recomendaciones' del sistema verás los libros más solicitados por otros usuarios.",
    },
    {
      pregunta: "¿Qué hago si el kiosko no reconoce mi credencial?",
      respuesta:
        "Asegúrate de que tu credencial esté activa. Si el problema continúa, acude al personal de la biblioteca.",
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200">
            <h2 className="text-lg font-semibold text-blue-700">
              {item.pregunta}
            </h2>
            <p className="text-gray-700 mt-2">{item.respuesta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
