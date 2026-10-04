import Link from 'next/link'

export const metadata = {
  title: 'Términos de Uso',
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

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-rose-900/30 border border-rose-700 text-rose-300 text-xs md:text-sm rounded-xl p-3 mb-6 font-semibold text-center">
          ⚠️ BORRADOR: pendiente de revisión legal
        </div>

        <Link href="/" className="text-amber-400 text-sm hover:underline inline-block mb-6">
          ← Volver al inicio
        </Link>

        <h1 className="text-amber-400 text-2xl md:text-3xl font-black mb-2">Términos de Uso</h1>
        <p className="text-xs text-gray-500 mb-8">Última actualización: [FECHA DE ÚLTIMA ACTUALIZACIÓN]</p>

        <Clausula numero={1} titulo="Aceptación y objeto del servicio">
          <p>
            Story Weaver Hub (la "Plataforma") es un servicio de conversación interactiva con personajes
            ficticios generados por inteligencia artificial. Al crear una cuenta o utilizar la Plataforma,
            aceptás estos Términos de Uso en su totalidad. Si no estás de acuerdo con alguna parte, no debés
            utilizar el servicio.
          </p>
        </Clausula>

        <Clausula numero={2} titulo="Edad mínima">
          <p>
            El acceso a la Plataforma está reservado exclusivamente a personas mayores de 18 años, o que
            hayan alcanzado la mayoría de edad según las leyes de su país de residencia si esta es superior.
            Al ingresar, se te solicita una declaración expresa de que cumplís con este requisito, y la fecha
            en que confirmás esa declaración queda registrada en nuestros sistemas. Nos reservamos el derecho
            de solicitar verificación adicional y de suspender o cerrar cualquier cuenta sobre la que existan
            dudas razonables respecto de la edad de su titular.
          </p>
        </Clausula>

        <Clausula numero={3} titulo="Naturaleza del servicio">
          <p>
            Los personajes disponibles en la Plataforma son ficticios y sus respuestas son generadas
            automáticamente por modelos de lenguaje de inteligencia artificial. Ningún personaje representa
            a una persona real, y las respuestas pueden contener errores, inconsistencias o información
            inexacta. El contenido generado no constituye consejo médico, psicológico, legal ni financiero
            de ningún tipo, y el uso de la Plataforma no sustituye una relación humana, un tratamiento
            profesional ni ningún tipo de asistencia especializada.
          </p>
        </Clausula>

        <Clausula numero={4} titulo="Cuenta de usuario">
          <p>
            Sos responsable de proporcionar datos veraces al registrarte, de mantener la confidencialidad de
            tu contraseña y de toda la actividad que ocurra bajo tu cuenta. Debés notificarnos de inmediato
            ante cualquier uso no autorizado de tu cuenta.
          </p>
        </Clausula>

        <Clausula numero={5} titulo="Tokens y compras">
          <p>
            Los tokens son un crédito de uso interno de la Plataforma, sin valor monetario fuera de ella, no
            canjeables por dinero y no transferibles entre cuentas. El desbloqueo de mensajes, fotos u otro
            contenido exclusivo dentro de un chat consume tokens según el precio indicado en cada caso.
          </p>
          <p>
            [VERIFICAR: los tokens no son reembolsables, salvo en los casos que exija la ley aplicable en tu
            jurisdicción]. El procesamiento de los pagos para la compra de tokens está a cargo de terceros
            proveedores de servicios de pago. La Plataforma no almacena los datos completos de tu tarjeta ni
            de tu medio de pago.
          </p>
          <p>
            La sección de suscripciones se encuentra marcada como "próximamente" y todavía no está disponible.
          </p>
        </Clausula>

        <Clausula numero={6} titulo="Contenido y conductas prohibidos">
          <p>Está terminantemente prohibido utilizar la Plataforma para:</p>
          <p>
            (a) generar, solicitar o compartir contenido que involucre menores de edad o personajes con
            apariencia de menores, en cualquier contexto; (b) generar contenido sexual no consentido o de
            naturaleza violenta hacia personas reales; (c) utilizar el nombre, la imagen, la voz o los rasgos
            distintivos de una persona real sin su consentimiento, incluyendo la creación de "deepfakes"; (d)
            acosar, intimidar u odiar a otras personas por motivo de su identidad; (e) realizar o promover
            actividades ilegales; (f) intentar eludir los filtros de contenido, los controles de verificación
            de edad o cualquier otra medida de seguridad de la Plataforma; (g) realizar scraping, ingeniería
            inversa o cualquier uso abusivo de nuestra API o infraestructura.
          </p>
          <p>
            El incumplimiento de esta cláusula habilita la suspensión o cierre inmediato de la cuenta, sin
            perjuicio de otras acciones legales que correspondan.
          </p>
        </Clausula>

        <Clausula numero={7} titulo="Personajes creados por usuarios">
          <p>
            Si creás un personaje propio en la Plataforma, sos el único responsable del contenido, los textos
            y las imágenes asociadas a ese personaje, y declarás que contás con los derechos necesarios sobre
            ese contenido. Al crearlo, otorgás a la Plataforma una licencia no exclusiva para alojarlo,
            procesarlo y mostrarlo dentro del servicio. Nos reservamos el derecho de moderar, rechazar o
            eliminar cualquier personaje creado por un usuario, sin aviso previo, si consideramos que infringe
            estos Términos.
          </p>
        </Clausula>

        <Clausula numero={8} titulo="Moderación y reportes">
          <p>
            Si detectás contenido que viola estos Términos, podés reportarlo a [EMAIL DE CONTACTO]. Cooperamos
            con las autoridades competentes cuando la ley así lo exige, y nos reservamos el derecho de
            suspender o cerrar cuentas que incumplan estos Términos. Todo contenido que involucre a menores
            de edad se reporta a las autoridades correspondientes, conforme a la legislación aplicable.
          </p>
        </Clausula>

        <Clausula numero={9} titulo="Propiedad intelectual">
          <p>
            El diseño, el software, las marcas, los personajes predefinidos y el resto del contenido propio
            de la Plataforma son de titularidad de [NOMBRE LEGAL DEL TITULAR] o de sus licenciantes, y están
            protegidos por las leyes de propiedad intelectual aplicables. No se concede ninguna licencia sobre
            estos elementos más allá del uso personal y no comercial del servicio.
          </p>
        </Clausula>

        <Clausula numero={10} titulo="Disponibilidad del servicio y exclusión de garantías">
          <p>
            La Plataforma se ofrece "tal cual" y "según disponibilidad". No garantizamos que el servicio esté
            libre de interrupciones, errores o fallas técnicas, ni que las respuestas generadas por los
            modelos de inteligencia artificial sean precisas, apropiadas o ininterrumpidas en todo momento.
          </p>
        </Clausula>

        <Clausula numero={11} titulo="Limitación de responsabilidad">
          <p>
            En la máxima medida permitida por la ley aplicable, la Plataforma, sus titulares y colaboradores
            no serán responsables por daños indirectos, incidentales o consecuentes derivados del uso o la
            imposibilidad de uso del servicio, incluyendo los que puedan surgir de la interacción con
            contenido generado por inteligencia artificial.
          </p>
        </Clausula>

        <Clausula numero={12} titulo="Terminación de la cuenta">
          <p>
            Podés eliminar tu cuenta en cualquier momento. Nosotros podemos suspender o cerrar tu cuenta, con
            o sin previo aviso, ante un incumplimiento de estos Términos o por razones de seguridad de la
            Plataforma o de otros usuarios.
          </p>
        </Clausula>

        <Clausula numero={13} titulo="Modificaciones de los términos">
          <p>
            Podemos modificar estos Términos en cualquier momento. Los cambios relevantes se informarán
            dentro de la Plataforma, y el uso continuado del servicio luego de dichos cambios implica su
            aceptación.
          </p>
        </Clausula>

        <Clausula numero={14} titulo="Ley aplicable y jurisdicción">
          <p>
            Estos Términos se rigen por las leyes de [PAÍS DE JURISDICCIÓN]. Cualquier controversia derivada
            de estos Términos se someterá a los tribunales competentes de dicha jurisdicción.
          </p>
        </Clausula>

        <Clausula numero={15} titulo="Contacto">
          <p>
            Ante cualquier consulta sobre estos Términos, podés escribirnos a [EMAIL DE CONTACTO].
          </p>
        </Clausula>

        <Link href="/" className="text-amber-400 text-sm hover:underline inline-block mt-4">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
