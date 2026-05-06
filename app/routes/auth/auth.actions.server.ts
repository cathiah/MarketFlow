import { createClient } from "~/lib/supabase.server";
import { data, href, redirect } from "react-router";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "L'identifiant est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

const registerSchema = z.object({
  full_name: z.string()
    .min(2, "Le nom est trop court."),
  
  username: z.string()
    .min(3, "3 caractères minimum.")
    .regex(/^[a-zA-Z0-9_]+$/, "Seuls les lettres, chiffres et underscores sont autorisés"),
  
  role: z.enum(["buyer", "seller"]).default("buyer"),

  email: z.string()
    .email("Email invalide."),
  
  password: z.string()
    .min(8, "8+ caractères et au moins 1 chiffre.")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
  
  accepted: z.any().refine((val) => val === "on", {
    message: "Vous devez accepter les conditions.",
  }),
});


export async function handleAuthAction(request: Request) {
  const { supabase, headers } = createClient(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const rawData = Object.fromEntries(formData);

  // --- LOGOUT ---
  if (intent === "logout") {
    await supabase.auth.signOut();
    return redirect(href("/auth/login"), { headers });
  }

  // --- LOGIN ---
  if (intent === "login") {
    const result = loginSchema.safeParse(rawData);
    if (!result.success) {
      return data({ success: false, errors: result.error.flatten().fieldErrors }, { status: 400, headers });
    }

    let { identifier, password } = result.data;
    let email = identifier;

    // Si l'identifiant n'est pas un email, chercher l'email via le username
    if (!identifier.includes("@")) {
      const { data: profileData, error: queryError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", identifier)
        .single();

      if (queryError || !profileData?.email) {
        return data({ success: false, error: "Identifiants incorrects." }, { headers });
      }
      email = profileData.email;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return data({ success: false, error: "Identifiants incorrects." }, { headers });

    return redirect(href("/"), { headers });
  }

  // --- REGISTER ---
  if (intent === "register") {
    const result = registerSchema.safeParse(rawData);
    if (!result.success) {
      return data({ success: false, errors: result.error.flatten().fieldErrors }, { status: 400, headers });
    }

    const { email, password, full_name, username, role } = result.data;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, username, role } }
    });

    if (error) return data({ success: false, error: error.message }, { headers });
    
    return data({ 
      success: true, 
      message: "Vérifiez vos e-mails pour confirmer l'inscription." 
    }, { headers });
  }

  return null;
}
