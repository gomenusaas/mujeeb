-- Trigger functions run only from their triggers; nobody calls them through the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.enforce_feature_switches() from public, anon, authenticated;
revoke execute on function public.sync_album_photos() from public, anon, authenticated;
alter function public.sync_album_photos() set search_path = public;
