// Add ticket
async function addTicket() {
    const name = document.getElementById("name").value;

    if (!name) return alert("Enter name");

    await supabase.from("tickets").insert([{ name }]);
    loadQueue();
}

// Remove (FIFO)
async function removeTicket() {
    const { data } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1);

    if (!data.length) return alert("Queue empty");

    await supabase.from("tickets").delete().eq("id", data[0].id);
    loadQueue();
}

// Clear queue
async function clearQueue() {
    await supabase.from("tickets").delete().neq("id", 0);
    loadQueue();
}

// Load queue
async function loadQueue() {
    const { data } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: true });

    let list = document.getElementById("queueList");
    list.innerHTML = "";

    data.forEach((t, index) => {
        let li = document.createElement("li");
        li.innerText = `${index + 1}. ${t.name}`;
        list.appendChild(li);
    });

    document.getElementById("stats").innerText =
        "Total Tickets: " + data.length;
}

// Real-time updates
supabase
    .channel("realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "tickets" },
        () => loadQueue()
    )
    .subscribe();

loadQueue();
