# CONTEXTO DE ARREGLOS DEL PROYECTO

## Estado general
SPA local para administrar Economia y Logistica con frontend offline-first conectado a Google Sheets por Apps Script. La prioridad del proyecto es mantener el frontend instantaneo aunque Google Sheets tarde en responder.

## Reglas permanentes
- No tocar Code.gs salvo pedido explicito.
- No romper offline-first.
- No romper localStorage.
- No romper cola pendiente.
- No romper create/update/delete genericos.
- Priorizar cambios encapsulados en app.js.
- Mantener frontend instantaneo aunque Google Sheets tarde en sincronizar.

## Cambios ya aplicados

### Beneficios - logica de tipos y tabs
- Tipo Beneficio convertido a select.
- Opciones: Venta de empanadas, Combos de limpieza, Otro.
- Tabs dinamicas segun tipo de beneficio.
- Empanadas muestra solo pedidos empanadas.
- Combos limpieza muestra solo combos limpieza.
- Se oculto Recuentos.
- Se mantienen Movimientos y Compras.

### Beneficios - formularios inteligentes
- Origen enum: Misionero, Misa, Otro.
- Si Origen = Misionero, se usa Nombre y Apellido desde Misioneros.
- Area se autocompleta desde el misionero.
- Si Origen = Misa/Otro, se muestran Nombre Cliente, Telefono y Persona Responsable.
- Persona Responsable es selector de Misioneros.
- Tiene la Plata es selector de Misioneros.
- Area es readonly.

### Beneficios - formatos numericos
- Se separo formato dinero de formato cantidad.
- Total Docenas, Combos Totales, Combo 1, Combo 2 y cantidades ya no se muestran como dinero.
- Campos monetarios siguen mostrandose como moneda.

### Movimientos Beneficios
- Movimiento es select Ingreso/Egreso.
- Tipo de Movimiento depende de Movimiento.
- Ingreso y Egreso tienen listas separadas.

### Vistas de Beneficios
- Beneficios se pueden filtrar por Tipo Beneficio.
- Se separan activos arriba e inactivos/cerrados abajo.
- Tablas de empanadas y combos muestran mas columnas relevantes.

## Pendientes conocidos
- Verificar que Google Sheets tenga realmente los encabezados nuevos, especialmente en Beneficio combos limpieza: Nombre y Apellido y Area.
- Probar persistencia despues de sincronizar y recargar.
- Revisar si conviene renombrar "Tiene la Plata" a "Persona que tiene la plata" mas adelante.
- Continuar luego con Misiones, Compras, Productos comprados, Deudores y Control General.

## Validaciones recomendadas
- Crear beneficio Venta de empanadas.
- Crear beneficio Combos de limpieza.
- Confirmar tabs correctas.
- Crear pedido con Origen Misionero.
- Confirmar autocompletado de Area.
- Crear pedido con Origen Misa/Otro.
- Confirmar que aparecen cliente, telefono y responsable.
- Sincronizar.
- Recargar.
- Confirmar que los datos persisten.

## Ultima intervencion de Codex
### 2026-05-26 10:47
- Se reorganizo la seccion Beneficios para que la vista principal tenga filtro por Tipo Beneficio, separacion entre activos e inactivos, y tablas por bloque.
- Se hizo dinamico el detalle de cada beneficio para mostrar solo tabs relevantes segun Tipo Beneficio.
- Se oculto la pestana Recuentos en frontend sin tocar backend.
- Se agrego dependencia entre Movimiento y Tipo de Movimiento en Movimientos Beneficios.
- Se mejoraron formularios de empanadas y combos con selects de misioneros, autocompletado de Area y comportamiento dependiente segun Origen.
- Se corrigio el formato visual de cantidades para que no aparezcan como moneda.
- Se dejo preparado el frontend para que Beneficio combos limpieza pueda usar Nombre y Apellido y Area si esos encabezados existen en Sheets.

## Ultima intervencion de Codex
### 2026-05-26 10:53

### Advertencia estructural de columnas
- Las columnas nuevas usadas por frontend solo persisten en Google Sheets si existen como encabezados reales en la hoja.
- Verificar especialmente Beneficio empanadas: Nombre y Apellido, Area.
- Verificar especialmente Beneficio combos limpieza: Nombre y Apellido, Area.
- Si alguna de esas columnas no existe en Sheets, el frontend puede mostrar y guardar localmente el dato, pero Apps Script no lo escribira en la hoja hasta que el encabezado exista.

### Misiones
- Se agregaron filtros por Año y Mes en la vista principal de Misiones.
- Los filtros toman preferentemente Fecha Inicio de la mision.
- Esto permite separar misiones con el mismo nombre pero distinto mes o año.

### Inscriptos
- El detalle de mision usa un helper dedicado para obtener inscriptos por IDMision exacto.
- No se filtra por nombre de mision, por lo que misiones con mismo nombre y distinta fecha no deberian mezclar inscriptos.

### Generacion de deudas
- En la pestaña Inscriptos se agrego el boton Generar deudas de esta mision.
- El flujo pide por prompt el valor de la mision por misionero.
- Crea localmente una obligacion en Cobros a misioneros con Tipo Origen = Mision y Fuente Deudores = Inscriptos.
- Crea localmente una deuda por cada inscripto resoluble contra Misioneros.
- Evita duplicar deudas existentes para la misma mision/obligacion/misionero.
- Si un inscripto no puede resolverse contra Misioneros, se salta y se muestra advertencia.
- Todo queda offline-first usando IDs temporales y cola pendiente.

### Deudores
- En Deudores se agrego el boton Pago total junto a Registrar pago.
- Pago total crea localmente un registro en Pagos Deudas por el Saldo Pendiente.
- La deuda se recalcula localmente para pasar a Pagado al instante.
- Registrar pago parcial mantiene el comportamiento existente y sigue recalculando saldo localmente.

### Pendientes conocidos
- Validar en Sheets los encabezados Nombre y Apellido y Area para Beneficio empanadas y Beneficio combos limpieza.
- Probar generacion de deudas con inscriptos que guardan Misionero como ID y con inscriptos que guardan nombre.
- Revisar si la obligacion de una misma mision debe poder generarse mas de una vez con distintos montos o conceptos.
- Probar sincronizacion, recarga y reemplazo de IDs temporales en Cobros a misioneros y Deudas Personas.

### Validaciones recomendadas
- Crear dos misiones con mismo nombre pero distintos meses.
- Filtrar Misiones por año y mes.
- Entrar a una mision y confirmar que solo muestra sus inscriptos.
- Generar deudas desde Inscriptos.
- Confirmar que aparecen en Deudores.
- Registrar pago parcial.
- Confirmar saldo pendiente.
- Registrar pago total.
- Confirmar deuda pagada.
- Sincronizar.
- Recargar.
- Confirmar persistencia.

## Ultima intervencion de Codex
### 2026-05-26 11:10

### Compras y productos comprados
- En formularios de Compras, Persona Responsable ahora filtra solo misioneros del area Economia y Logistica.
- Tipo Compra en Compras ahora es enum: Supermercado, Verduleria, Carniceria, Panaderia, Farmacia, Libreria, Otros.
- Categoria en Elementos comprados usa el mismo enum de rubros de compra.
- Unidad en Elementos comprados ahora es enum: kg, litros, unidad, paquete, caja, frasco, botella, bolsa, otro.
- Comprar en Elementos comprados se calcula automaticamente como max(0, Necesitamos - Tenemos).
- Comprar queda como input numerico readonly para evitar errores manuales.
- Subtotal sigue calculandose como Comprar * Precio Unitario y se actualiza en vivo junto con Necesitamos, Tenemos y Precio Unitario.
- La vista de detalle de compra mantiene la tabla con Categoria, Producto, Unidad, Necesitamos, Tenemos, Comprar, Precio Unitario, Subtotal y Comentario.
- No se tocaron backend, sync, localStorage, cola pendiente ni create/update/delete genericos.

### Pendientes conocidos
- Validar que los valores de Area en Misioneros coincidan con Economia y Logistica para que el filtro de Persona Responsable en Compras muestre opciones.
- Probar guardado y sincronizacion de Elementos comprados despues de recalcular Comprar y Subtotal.

### Validaciones recomendadas
- Crear una compra y confirmar que Persona Responsable solo muestra misioneros de Economia y Logistica.
- Confirmar que Tipo Compra muestra el enum de rubros.
- Entrar al detalle de compra y agregar un elemento.
- Confirmar que Categoria y Unidad usan enums.
- Cargar Necesitamos = 5 y Tenemos = 3; confirmar Comprar = 2.
- Cargar Precio Unitario = 1000; confirmar Subtotal = 2000.
- Guardar, sincronizar y recargar para confirmar persistencia.

## Ultima intervencion de Codex
### 2026-05-26 11:30

### Deudores y Control General
- Deudores ahora normaliza cada deuda antes de mostrarla.
- Si faltan Monto Pagado o Saldo Pendiente, se recalculan localmente usando pagos y Monto Esperado.
- Deudores filtra deuda pendiente real: muestra saldos positivos o estados distintos de Pagado, y oculta lo pagado sin saldo.
- Se agregaron tarjetas de resumen en Deudores: Total deuda esperada, Total pagado, Total pendiente y Deudores pendientes.
- Se mantienen los botones Registrar pago y Pago total con comportamiento offline-first.
- Control General ahora construye filas consolidadas desde control. General y tambien desde Movimientos Beneficios, Movimientos Misiones, Pagos Deudas, pedidos de empanadas, combos limpieza, elementos comprados y deudas pendientes.
- Control General distingue Tipo = Ingreso, Egreso y Pendiente.
- Las tarjetas de Control General se recalculan segun filtros: Total ingresos, Total egresos, Saldo final, Pendiente por cobrar y Registros analizados.
- Se agrego resumen narrativo automatico debajo de las tarjetas.
- La tabla de Control General muestra registros consolidados solo si existen filas para los filtros.
- No se tocaron backend, sync, localStorage, cola pendiente ni create/update/delete genericos.

### Pendientes conocidos
- Validar que no haya duplicados entre control. General y tablas origen, especialmente si alguna fila historica de control no tiene Tabla Origen + IDOrigen.
- Probar ingresos y egresos de beneficios.
- Probar ingresos y egresos de misiones.
- Probar compras como egresos desde elementos comprados.
- Probar pagos de deudas como ingresos.
- Probar pedidos de empanadas y combos como ingresos o pendientes.
- Probar filtros por año, mes, origen, tipo, persona responsable y forma de pago.

### Validaciones recomendadas
- Crear beneficio con ingreso de 5.000.000 y egreso de 3.000.000.
- Confirmar en Control General ingresos 5.000.000, egresos 3.000.000 y saldo 2.000.000.
- Crear mision con deudas pendientes y confirmar pendiente por cobrar.
- Registrar pago parcial y confirmar que baja pendiente.
- Registrar pago total y confirmar que desaparece de Deudores.
- Filtrar por año y mes y confirmar que cambian tarjetas, informe y tabla.
- Sincronizar, recargar y confirmar persistencia.
