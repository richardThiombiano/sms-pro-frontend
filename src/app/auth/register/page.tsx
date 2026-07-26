"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Building2,
  User,
  Mail,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const features = [
  "100 SMS offerts à l'inscription",
  "Templates professionnels inclus",
  "Gestion de contacts illimitée",
  "Statistiques en temps réel",
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-700" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <Send className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">SMS Pro</span>
          </div>

          <div className="space-y-8">
            <h1 className="text-4xl font-bold leading-tight">
              Lancez-vous en
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                quelques minutes
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-md leading-relaxed">
              Rejoignez les entreprises qui utilisent SMS Pro pour communiquer
              efficacement avec leurs clients.
            </p>

            {/* Features list */}
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <span className="text-white/70">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-sm text-white/70 italic leading-relaxed">
              "SMS Pro nous a permis d'augmenter notre taux de rétention client
              de 35%. La plateforme est intuitive et les résultats sont
              immédiats."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xs font-bold text-white">
                AK
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">Aminata K.</p>
                <p className="text-xs text-white/50">CEO, DigiCommerce</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Register form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/25">
              <Send className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">SMS Pro</span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              Créer votre compte
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === 1
                ? "Informations sur votre entreprise"
                : "Vos informations personnelles"}
            </p>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  step >= 1
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                1
              </div>
              <span className="text-xs font-medium text-foreground">
                Entreprise
              </span>
            </div>
            <div className="flex-1 h-[2px] bg-border rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full bg-primary transition-all duration-500",
                  step >= 2 ? "w-full" : "w-0"
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  step >= 2
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                2
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Profil
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nom de l'entreprise
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Ma Super Entreprise"
                      className="h-11 pl-10 bg-muted/30 border-border/50 focus:border-primary/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email professionnel
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="contact@entreprise.com"
                      className="h-11 pl-10 bg-muted/30 border-border/50 focus:border-primary/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Téléphone (optionnel)
                  </label>
                  <Input
                    type="tel"
                    placeholder="+225 XX XX XX XX XX"
                    className="h-11 bg-muted/30 border-border/50 focus:border-primary/40"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Prénom
                    </label>
                    <Input
                      placeholder="Mohamed"
                      className="h-11 bg-muted/30 border-border/50 focus:border-primary/40"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Nom
                    </label>
                    <Input
                      placeholder="Thiombiano"
                      className="h-11 bg-muted/30 border-border/50 focus:border-primary/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 caractères"
                      className="h-11 pl-10 pr-10 bg-muted/30 border-border/50 focus:border-primary/40"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Confirmez votre mot de passe"
                      className="h-11 pl-10 bg-muted/30 border-border/50 focus:border-primary/40"
                      required
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-muted-foreground leading-relaxed"
                  >
                    J'accepte les{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      conditions d'utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      politique de confidentialité
                    </Link>
                  </label>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => setStep(1)}
                >
                  Retour
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "h-11 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium shadow-lg shadow-primary/25 transition-all duration-200",
                  step === 1 ? "w-full" : "flex-1"
                )}
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {step === 1 ? "Continuer" : "Créer mon compte"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {step === 1 && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">
                    ou
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-11 border-border/50 hover:bg-muted/50"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                S'inscrire avec Google
              </Button>
            </>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
