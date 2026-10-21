-- Step 4 on stage: a real rule. Each user sees only their own row.
CREATE POLICY "own rows only" ON public.students
  FOR SELECT USING (auth.uid() = user_id);
