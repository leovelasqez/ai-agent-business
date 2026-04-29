# MockForge Operations Runbook

Owner operativo de launch: Leo.

## Canales y accesos

- Vercel project: `mockforge` (`https://mockforge-gray.vercel.app`)
- Supabase project: `lbcrvwbsxzcyrxvnjwtf`
- Soporte público: `support@mockforge.ai`
- Logs runtime: Vercel Logs (`vercel logs mockforge-gray.vercel.app`) y logs estructurados JSON con `requestId`.

## Incidentes: owners

- Fallos de generación: Leo
- Fallos de Stripe/pagos: Leo
- Storage/Supabase: Leo
- Deploy/build/Vercel: Leo

## Alertas mínimas para launch

Configurar en Sentry/Vercel/Stripe/Supabase según disponibilidad:

1. Spike de errores 5xx
   - Umbral inicial: más de 5 errores 5xx en 10 minutos.
   - Acción: revisar Vercel logs por `requestId`, endpoint y stack trace.

2. Webhook failures de Stripe
   - Umbral inicial: cualquier fallo sostenido de `checkout.session.completed`.
   - Acción: revisar Stripe Dashboard > Developers > Webhooks, reintentar evento y verificar `credit_transactions`.

3. Budget/coste excedido
   - Umbral inicial: gasto diario de provider de imagen mayor al presupuesto operativo definido para el día.
   - Acción: pausar tráfico pago/ad campaigns y revisar generaciones abusivas.

4. Storage fallback frecuente
   - Umbral inicial: más de 3 fallbacks de storage en 30 minutos.
   - Acción: revisar Supabase Storage buckets `mockforge-inputs` y `mockforge-outputs`, permisos y errores en logs.

## Soporte manual para pagos fallidos

1. Pedir al usuario email de cuenta y receipt/session id de Stripe.
2. Buscar el evento en Stripe Dashboard.
3. Si Stripe confirmó pago pero MockForge no otorgó créditos:
   - Verificar si existe `credit_transactions` con idempotency key del checkout/session.
   - Si no existe, otorgar créditos manualmente usando el RPC/flujo administrativo correspondiente.
   - Registrar motivo y session id para evitar doble grant.
4. Si el webhook falló:
   - Reintentar evento desde Stripe Dashboard.
   - Confirmar que el usuario ve créditos actualizados.
5. Si el pago no se completó en Stripe:
   - No otorgar créditos manuales salvo decisión explícita de goodwill.

## Backups Supabase

Estado verificado por CLI el 2026-04-25:

```json
{
  "pitr_enabled": false,
  "walg_enabled": true,
  "backups": []
}
```

PITR no está activo. Antes de launch público general, confirmar desde Supabase Dashboard el plan/backups disponibles o activar PITR si aplica.
