import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad',
}

function Clausula({ numero, titulo, children }: { numero: number; titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="text-amber-400 font-bold text-base md:text-lg mb-2">
        {numero}. {titulo}
      </h2>
      <div className="text-gray-300 text-sm md:text-base leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  )
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-rose-900/30 border border-rose-700 text-rose-300 text-xs md:text-sm rounded-xl p-3 mb-6 font-semibold text-center">
          ⚠️ BORRADOR: pendiente de revisión legal
        </div>

        <Link href="/" className="text-amber-400 text-sm hover:underline inline-block mb-6">
          ← Volver al inicio
        </Link>

        <h1 className="text-amber-400 text-2xl md:text-3xl font-black mb-2">Política de Privacidad</h1>
        <p className="text-xs text-gray-500 mb-8">Última actualización: [FECHA DE ÚLTIMA ACTUALIZACIÓN]</p>

        <Clausula numero={1} titulo="Responsable del tratamiento">
          <p>
            El responsable del tratamiento de los datos personales recopilados a través de esta Plataforma es
            [NOMBRE LEGAL DEL TITULAR]. Podés contactarnos sobre cualquier tema relacionado con esta política
            escribiendo a [EMAIL DE CONTACTO].
          </p>
        </Clausula>

        <Clausula numero={2} titulo="Datos que recopilamos">
          <p>Recopilamos los siguientes datos cuando usás la Plataforma:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>Tu correo electrónico y el apodo o nombre de usuario que elegís al registrarte.</li>
            <li>La fecha en la que confirmás ser mayor de edad al ingresar por primera vez.</li>
            <li>Los mensajes que enviás en los chats, incluyendo las notas de voz que grabás.</li>
            <li>Los personajes que creás dentro de la Plataforma.</li>
            <li>Tu saldo de tokens y el historial de movimientos asociado a tu cuenta.</li>
            <li>Tu progreso dentro de las historias interactivas (qué escenas desbloqueaste).</li>
            <li>Datos técnicos básicos de conexión necesarios para operar el servicio.</li>
            <li>Tu estado de conexión activa ("en línea ahora"), mientras tenés la Plataforma abierta.</li>
          </ul>
        </Clausula>

        <Clausula numero={3} titulo="Naturaleza sensible de las conversaciones">
          <p>
            Las conversaciones que mantenés con los personajes pueden incluir información personal, emocional
            o íntima. Somos conscientes de la naturaleza sensible de este contenido y lo tratamos con
            especial cuidado, aplicando las medidas de seguridad y acceso restringido descriptas en esta
            política.
          </p>
        </Clausula>

        <Clausula numero={4} titulo="Para qué usamos tus datos">
          <p>
            Usamos tus datos para: prestar y operar el servicio; procesar las compras de tokens que realizás;
            prevenir el abuso y proteger la seguridad de la Plataforma y de sus usuarios; cumplir con
            obligaciones legales; y mejorar la calidad y el funcionamiento del servicio.
          </p>
        </Clausula>

        <Clausula numero={5} titulo="Terceros que procesan tus datos">
          <p>Para operar la Plataforma, compartimos datos con los siguientes proveedores:</p>
          <ul className="list-disc list-inside space-y-1.5 ml-1">
            <li>
              <strong className="text-gray-200">Supabase</strong>: aloja nuestra base de datos, gestiona la
              autenticación de usuarios y almacena los archivos que subís (como las notas de voz).
            </li>
            <li>
              <strong className="text-gray-200">Vercel</strong>: aloja la aplicación web.
            </li>
            <li>
              <strong className="text-gray-200">OpenRouter</strong> y los proveedores de modelos de lenguaje
              que utiliza para generar respuestas: procesan el texto de tus mensajes para generar las
              respuestas de los personajes.
            </li>
            <li>
              <strong className="text-gray-200">RunPod</strong>, para la generación de imágenes [VERIFICAR:
              solo si ya está activo — a la fecha de esta versión, esta funcionalidad no está implementada en
              la Plataforma].
            </li>
            <li>
              Procesadores de pago para la compra de tokens [VERIFICAR: nombres cuando estén definidos]. La
              Plataforma no almacena los datos completos de tu tarjeta; esa información es procesada
              directamente por el proveedor de pagos.
            </li>
          </ul>
        </Clausula>

        <Clausula numero={6} titulo="Transferencias internacionales de datos">
          <p>
            Algunos de los proveedores mencionados en el punto anterior pueden procesar o almacenar datos en
            servidores ubicados fuera de tu país de residencia. En esos casos, procuramos que el tratamiento
            se realice conforme a garantías adecuadas de protección de datos.
          </p>
        </Clausula>

        <Clausula numero={7} titulo="Plazos de conservación">
          <p>
            Conservamos tus datos mientras tu cuenta se mantenga activa [VERIFICAR: plazo exacto de
            conservación posterior al cierre de cuenta]. Si solicitás la eliminación de tu cuenta, eliminamos
            o anonimizamos tus datos personales, salvo que debamos conservar cierta información por
            obligación legal.
          </p>
        </Clausula>

        <Clausula numero={8} titulo="Tus derechos">
          <p>
            Según la legislación de tu país, podés tener derecho a acceder, rectificar, suprimir, oponerte al
            tratamiento y solicitar la portabilidad de tus datos personales. Por ejemplo, estos derechos están
            reconocidos en normas como la Ley 25.326 de Protección de Datos Personales de Argentina, la Ley
            Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México, la
            Ley 1581 de 2012 de Colombia, o el Reglamento General de Protección de Datos (RGPD) de la Unión
            Europea, entre otras normas que puedan aplicarte según tu ubicación [VERIFICAR CON ABOGADO: alcance
            exacto de estos derechos según cada jurisdicción].
          </p>
          <p>Para ejercer cualquiera de estos derechos, escribinos a [EMAIL DE CONTACTO].</p>
        </Clausula>

        <Clausula numero={9} titulo="Menores de edad">
          <p>
            Este servicio está destinado exclusivamente a personas mayores de 18 años. Si tomamos
            conocimiento de que una cuenta pertenece a una persona menor de edad, procedemos a eliminarla.
          </p>
        </Clausula>

        <Clausula numero={10} titulo="Cookies y almacenamiento local">
          <p>
            Utilizamos cookies y almacenamiento local del navegador para mantener tu sesión iniciada y
            recordar ciertas preferencias dentro de la Plataforma. No utilizamos estas tecnologías con fines
            publicitarios de terceros.
          </p>
        </Clausula>

        <Clausula numero={11} titulo="Seguridad de los datos">
          <p>
            Aplicamos medidas técnicas y organizativas razonables para proteger tus datos, incluyendo
            controles de acceso a nivel de base de datos que restringen que cada usuario solo pueda ver su
            propia información. Ningún sistema es completamente infalible, por lo que no podemos garantizar
            una seguridad absoluta.
          </p>
        </Clausula>

        <Clausula numero={12} titulo="Cambios en esta política">
          <p>
            Podemos actualizar esta Política de Privacidad en cualquier momento. Los cambios relevantes se
            informarán dentro de la Plataforma.
          </p>
        </Clausula>

        <Clausula numero={13} titulo="Contacto">
          <p>
            Para cualquier consulta relacionada con esta Política de Privacidad, podés escribirnos a [EMAIL DE
            CONTACTO].
          </p>
        </Clausula>

        <Link href="/" className="text-amber-400 text-sm hover:underline inline-block mt-4">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
