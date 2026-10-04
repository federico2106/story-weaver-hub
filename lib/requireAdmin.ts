import { createClient } from '@/lib/supabase/server'

type RequireAdminResult =
  | { authorized: true; supabase: Awaited<ReturnType<typeof createClient>>; userId: string }
  | { authorized: false; status: number; error: string }

export async function requireAdmin(): Promise<RequireAdminResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { authorized: false, status: 401, error: 'No autenticado.' }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (error || !profile?.is_admin) {
    return { authorized: false, status: 403, error: 'No autorizado.' }
  }

  return { authorized: true, supabase, userId: user.id }
}
