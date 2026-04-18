async function signup(email, password) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
}

async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
}
