"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Building2,
  Users,
  Lock,
  Save,
  Plus,
  Edit,
  Trash2,
  Power,
  Loader2,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const isOwner = user?.role === "owner" || user?.role === "superadmin";
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "password", label: "Sécurité", icon: Lock },
    ...(isOwner ? [
      { id: "company", label: "Entreprise", icon: Building2 },
      { id: "team", label: "Équipe", icon: Users },
    ] : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez votre profil et votre entreprise</p>
      </div>

      <div className="flex gap-6">
        {/* Navigation latérale */}
        <nav className="w-56 shrink-0">
          <div className="sticky top-20 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Contenu */}
        <div className="flex-1 max-w-2xl">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "password" && <PasswordSection />}
          {activeTab === "company" && isOwner && <CompanySection />}
          {activeTab === "team" && isOwner && <TeamSection />}
        </div>
      </div>
    </div>
  );
}

// ============================================
// PROFIL
// ============================================

function ProfileSection() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    api.getProfile().then((data) => {
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setEmail(data.email || "");
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.updateProfile({ first_name: firstName, last_name: lastName, email });
      setSuccess("Profil mis à jour");
      fetchUser();
    } catch (err: any) {
      setError(err.message || "Erreur");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Profil</CardTitle>
            <p className="text-xs text-muted-foreground">Vos informations personnelles</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="p-3 rounded-lg bg-destructive/10 text-sm text-destructive">{error}</div>}
        {success && <div className="p-3 rounded-lg bg-emerald-500/10 text-sm text-emerald-600">{success}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prénom</label>
            <Input className="h-10" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom</label>
            <Input className="h-10" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" className="h-10" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-primary to-purple-600 text-white">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Enregistrer
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================
// MOT DE PASSE
// ============================================

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.changePassword({ current_password: currentPassword, new_password: newPassword });
      setSuccess("Mot de passe modifié");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Erreur");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
            <Lock className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-base">Mot de passe</CardTitle>
            <p className="text-xs text-muted-foreground">Modifier votre mot de passe</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="p-3 rounded-lg bg-destructive/10 text-sm text-destructive">{error}</div>}
        {success && <div className="p-3 rounded-lg bg-emerald-500/10 text-sm text-emerald-600">{success}</div>}

        <div className="space-y-2">
          <label className="text-sm font-medium">Mot de passe actuel</label>
          <Input type="password" className="h-10" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nouveau mot de passe</label>
            <Input type="password" className="h-10" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirmer</label>
            <Input type="password" className="h-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving || !currentPassword || !newPassword}
          className="bg-gradient-to-r from-primary to-purple-600 text-white">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
          Changer le mot de passe
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================
// ENTREPRISE (owner uniquement)
// ============================================

function CompanySection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("");
  const [provider, setProvider] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCompany().then((data) => {
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setPlan(data.plan || "");
      setProvider(data.sms_provider || "");
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.updateCompany({ name, email, phone });
      setSuccess("Informations mises à jour");
    } catch (err: any) {
      setError(err.message || "Erreur");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-base">Entreprise</CardTitle>
            <p className="text-xs text-muted-foreground">Informations de votre entreprise</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="p-3 rounded-lg bg-destructive/10 text-sm text-destructive">{error}</div>}
        {success && <div className="p-3 rounded-lg bg-emerald-500/10 text-sm text-emerald-600">{success}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom de l'entreprise</label>
            <Input className="h-10" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" className="h-10" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Téléphone</label>
            <Input className="h-10" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Plan</label>
            <Input className="h-10 bg-muted/50" value={plan} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Provider SMS</label>
            <Input className="h-10 bg-muted/50 uppercase" value={provider} disabled />
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-primary to-purple-600 text-white">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Enregistrer
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================
// ÉQUIPE (owner uniquement)
// ============================================

function TeamSection() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const currentUser = useAuthStore((state) => state.user);

  const fetchTeam = () => {
    setIsLoading(true);
    api.getTeam().then((data) => setMembers(data.items)).catch(() => {}).finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleToggle = async (userId: string, currentActive: boolean) => {
    await api.updateTeamMember(userId, { is_active: !currentActive });
    fetchTeam();
  };

  const handleDelete = async (id: string) => {
    await api.removeTeamMember(id);
    fetchTeam();
    setShowDeleteConfirm(false);
    setDeletingId(null);
  };

  const roleLabels: Record<string, string> = {
    owner: "Propriétaire",
    admin: "Administrateur",
    member: "Membre",
  };

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base">Équipe</CardTitle>
              <p className="text-xs text-muted-foreground">{members.length} membre(s)</p>
            </div>
          </div>
          <Button size="sm" onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-primary to-purple-600 text-white">
            <Plus className="mr-2 h-3.5 w-3.5" />
            Inviter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xs font-semibold text-primary">
                      {(member.first_name || "?")[0]}{(member.last_name || "?")[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("text-[10px]",
                    member.role === "owner" ? "bg-blue-500/10 text-blue-600 border-blue-200" :
                    member.role === "admin" ? "bg-purple-500/10 text-purple-600 border-purple-200" :
                    "bg-gray-500/10 text-gray-600 border-gray-200"
                  )}>
                    {roleLabels[member.role] || member.role}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[10px]",
                    member.is_active ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" : "bg-red-500/10 text-red-500 border-red-200"
                  )}>
                    {member.is_active ? "Actif" : "Inactif"}
                  </Badge>
                  {member.id !== currentUser?.id && member.role !== "owner" && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-amber-500"
                        onClick={() => handleToggle(member.id, member.is_active)}
                        title={member.is_active ? "Désactiver" : "Activer"}>
                        <Power className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500"
                        onClick={() => { setDeletingId(member.id); setShowDeleteConfirm(true); }}
                        title="Retirer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Member Modal */}
        {showAddModal && (
          <AddMemberModal onClose={() => setShowAddModal(false)} onAdded={fetchTeam} />
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => { setShowDeleteConfirm(false); setDeletingId(null); }} />
            <div className="relative z-10 w-full max-w-sm mx-4 bg-background rounded-2xl border border-border shadow-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Retirer ce membre</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Cette action est irréversible.</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1"
                  onClick={() => { setShowDeleteConfirm(false); setDeletingId(null); }}>Annuler</Button>
                <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => { if (deletingId) handleDelete(deletingId); }}>
                  <Trash2 className="mr-2 h-4 w-4" /> Retirer
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddMemberModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !password) {
      setError("Remplissez tous les champs obligatoires");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await api.addTeamMember({ email, first_name: firstName, last_name: lastName, password, role });
      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 bg-background rounded-2xl border border-border shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Inviter un membre</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="p-3 rounded-lg bg-destructive/10 text-sm text-destructive">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prénom *</label>
              <Input className="h-10" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input className="h-10" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email *</label>
            <Input type="email" className="h-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe *</label>
              <Input type="password" className="h-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rôle</label>
              <Input className="h-10 bg-muted/50" value="Membre" disabled />
            </div>
          </div>
          <Separator />
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-purple-600 text-white" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Inviter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
