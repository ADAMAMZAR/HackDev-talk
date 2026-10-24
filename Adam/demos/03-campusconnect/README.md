# 03 · CampusConnect: "Your database is open by default"

A student portal. After you sign in it shows only your own profile and says "Only you can see your details." That's true in the UI only. The database gives every row to anyone who asks.

## One-time setup

1. **Supabase → Authentication → Users → Add user → Create new user**, twice, with **Auto Confirm User** ticked:
   - `aina@campus.example`
   - `daniel@campus.example`

   Both accounts use the demo password `test123`.
2. **Supabase → SQL Editor:** paste `supabase/01-seed.sql` and click Run. The last line should show `students = 40, linked_to_a_login = 2`.
3. **Supabase → SQL Editor:** paste `supabase/demo-controls.sql` and click Run. This lets the Demo panel's buttons run the SQL steps.
4. Double-click `start-demos.bat` in the project root, or run `npm run dev` here. It opens at http://localhost:5103.

## On stage (5:00–9:00)

Click the **Demo** pill (bottom right), or press **`** (the backtick key), to open the Demo controls. Each step shows its code on screen, so the audience still sees the SQL.

| Step | Click | Expect |
|---|---|---|
| 1 | **Run as attacker** (stay signed out) | **40 rows**: names, matric numbers, phones. "I don't even have an account." |
| 2 | **Run SQL** under "Turn the lock on" | Chip changes to **RLS ON** |
| 3 | **Run as attacker** again | **0 rows `[]`**. "Same code, same key, nothing comes back." |
| 4 | **Run SQL** under "Add a real rule", then **Sign in as Aina** | Aina's ID card appears, and only hers |
| 5 *(optional)* | **Run SQL** under "The fake fix", then **Run as attacker** | **40 rows again**: `USING (true)` undid the lock. Then click **Reset demo** |

For the "hiding a button is not a lock" line, point at the grey note above step 1 in the panel: the app's own query has `.eq('user_id', user.id)`. The privacy lives in the browser, and the attacker never uses the browser UI. No need to open `src/App.jsx`.

To finish, click **Security Advisor ↗** in the panel footer. It opens the Supabase dashboard page (you must already be logged in to Supabase in this browser).

The attacker button also prints the rows with `console.table`, so if DevTools is open the audience sees them there too. The SQL files in `supabase/` still work if you'd rather use the SQL Editor.

## Reset between rehearsals

Click **Reset demo** in the panel. It turns RLS off, removes all policies and signs you out. The data itself never changes, so you don't need to run `01-seed.sql` again.
