-- SHOW ONLY. DON'T RUN.
-- The fake fix: RLS is "on", but this policy lets everyone read every row again.
CREATE POLICY "allow all" ON public.students
  FOR SELECT USING (true);
