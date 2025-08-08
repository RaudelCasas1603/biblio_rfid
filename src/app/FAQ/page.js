import KioskoFAQ from "../Components/KioskoFAQ";

export default function FAQ() {
  return (
    <>
      <h1 className="text-4xl font-bold flex justify-center">
        Preguntas Frecuentes
      </h1>
      <h2 className="text-2xl font-semibold justify-center text-center mt-4">
        En esta sección encontras las preguntas más frecuentes a la hora de usar
        el Kiosko
      </h2>
      <KioskoFAQ />
    </>
  );
}
