"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Plus,
  Search,
  CreditCard,
  Power,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  BarChart3,
  Users,
  MessageSquare,
  Target,
  CheckCircle2,
  XCircle,
  Edit,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<boolean | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [togglingTenant, setTogglingTenant] = useState<any>(null);

  const fetchTenants = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = { page, page_size: 20 };
      if (searchQuery) params.search = searchQuery;
      if (filterStatus !== null) params.is_active = filterStatus;
      const data = await api.getAdminTenants(params);
      setTenants(data.items);
      setTotal(data.total);
    } catch {}
    setIsLoading(false);
  }, [page, searchQuery, filterStatus]);

  useEffect(() => { fetchTenants(); }, [fetchTenants]);

  const handleToggle = async (tenantId: string) => {
    await api.toggleTenant(tenantId);
    fetchTenants();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Entreprises</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} entreprise(s) enregistrée(s)</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle entreprise
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="border border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, slug..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="h-9 pl-9 bg-muted/30 border-border/50"
              />
            </div>
            <select
              className="h-9 rounded-md border border-border/50 bg-muted/30 px-3 text-sm"
              value={filterStatus === null ? "" : filterStatus ? "true" : "false"}
              onChange={(e) => { setFilterStatus(e.target.value === "" ? null : e.target.value === "true"); setPage(1); }}
            >
              <option value="">Tous les statuts</option>
              <option value="true">Actifs</option>
              <option value="false">Inactifs</option>
            </select>
            {(searchQuery || filterStatus !== null) && (
              <Button variant="ghost" size="sm" className="h-9 text-xs text-muted-foreground"
                onClick={() => { setSearchQuery(""); setFilterStatus(null); setPage(1); }}>
                Réinitialiser
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
      ) : (
        <Card className="border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Entreprise</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Propriétaire</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">API SMS</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Statut</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{tenant.name}</p>
                        <p className="text-xs text-muted-foreground">{tenant.email}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{tenant.slug}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {tenant.owner ? (
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {tenant.owner.first_name} {tenant.owner.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{tenant.owner.email}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div>
                        <Badge variant="outline" className="text-[10px] uppercase mb-1">{tenant.sms_provider}</Badge>
                        {tenant.smsbus_sender_id && (
                          <p className="text-[10px] text-muted-foreground">Sender: {tenant.smsbus_sender_id}</p>
                        )}
                        {tenant.smsbus_username && (
                          <p className="text-[10px] text-muted-foreground">User: {tenant.smsbus_username}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={cn("text-[10px]",
                        tenant.is_active ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" : "bg-red-500/10 text-red-500 border-red-200"
                      )}>
                        {tenant.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => { setSelectedTenant(tenant); setShowEditModal(true); }}
                          title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => { setSelectedTenant(tenant); setShowStatsModal(true); }}
                          title="Statistiques">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon"
                          className={cn("h-8 w-8", tenant.is_active ? "text-muted-foreground hover:text-red-500" : "text-muted-foreground hover:text-emerald-500")}
                          onClick={() => { setTogglingTenant(tenant); setShowToggleConfirm(true); }}
                          title={tenant.is_active ? "Désactiver" : "Activer"}>
                          <Power className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTenant && (
        <EditTenantModal
          tenant={selectedTenant}
          onClose={() => { setShowEditModal(false); setSelectedTenant(null); }}
          onSaved={fetchTenants}
        />
      )}

      {/* Stats Modal */}
      {showStatsModal && selectedTenant && (
        <TenantStatsModal
          tenant={selectedTenant}
          onClose={() => { setShowStatsModal(false); setSelectedTenant(null); }}
        />
      )}

      {/* Credits Modal */}
      {showCreditsModal && selectedTenant && (
        <CreditsModal
          tenant={selectedTenant}
          onClose={() => { setShowCreditsModal(false); setSelectedTenant(null); }}
          onSaved={fetchTenants}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTenantModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchTenants}
        />
      )}

      {/* Toggle Confirmation */}
      {showToggleConfirm && togglingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { setShowToggleConfirm(false); setTogglingTenant(null); }} />
          <div className="relative z-10 w-full max-w-sm mx-4 bg-background rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full",
                togglingTenant.is_active ? "bg-red-500/10" : "bg-emerald-500/10"
              )}>
                <Power className={cn("h-5 w-5", togglingTenant.is_active ? "text-red-500" : "text-emerald-500")} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {togglingTenant.is_active ? "Désactiver" : "Activer"} l'entreprise
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {togglingTenant.is_active
                    ? `"${togglingTenant.name}" et ses utilisateurs ne pourront plus accéder à la plateforme.`
                    : `"${togglingTenant.name}" pourra à nouveau accéder à la plateforme.`}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1"
                onClick={() => { setShowToggleConfirm(false); setTogglingTenant(null); }}>
                Annuler
              </Button>
              <Button className={cn("flex-1 text-white",
                togglingTenant.is_active ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
              )}
                onClick={async () => {
                  await api.toggleTenant(togglingTenant.id);
                  fetchTenants();
                  setShowToggleConfirm(false);
                  setTogglingTenant(null);
                }}>
                <Power className="mr-2 h-4 w-4" />
                {togglingTenant.is_active ? "Désactiver" : "Activer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreditsModal({ tenant, onClose, onSaved }: { tenant: any; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setIsSaving(true);
    try {
      await api.updateTenantCredits(tenant.id, parseInt(amount));
      onSaved();
      onClose();
    } catch {}
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm mx-4 bg-background rounded-2xl border border-border shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Gérer les crédits</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <p className="text-sm text-muted-foreground">
            {tenant.name} — <span className="font-semibold text-foreground">{tenant.sms_credits} crédits</span> actuels
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium">Crédits à ajouter/retirer</label>
            <Input type="number" placeholder="Ex: 500 ou -100" className="h-10" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <p className="text-xs text-muted-foreground">Positif pour ajouter, négatif pour retirer</p>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Appliquer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateTenantModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    smsbus_username: "", smsbus_password: "", smsbus_id: "", smsbus_sender_id: "",
    owner_first_name: "", owner_last_name: "", owner_email: "", owner_password: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.owner_first_name || !form.owner_password) {
      setError("Remplissez tous les champs obligatoires"); return;
    }
    setIsSaving(true);
    setError("");
    try {
      await api.createAdminTenant(form);
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur");
    }
    setIsSaving(false);
  };

  const updateForm = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl mx-4 bg-background rounded-2xl border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
          <h3 className="text-lg font-semibold">Nouvelle entreprise</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {error && <div className="p-3 rounded-lg bg-destructive/10 text-sm text-destructive">{error}</div>}

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Informations entreprise</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nom *</label>
              <Input className="h-10" value={form.name} onChange={(e) => updateForm("name", e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email *</label>
              <Input type="email" className="h-10" value={form.email} onChange={(e) => updateForm("email", e.target.value)} required />
            </div>
          </div>

          <Separator />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paramètres API SMS</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Username SMS API</label>
              <Input className="h-10" placeholder="smsbus_username" value={form.smsbus_username} onChange={(e) => updateForm("smsbus_username", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Password SMS API</label>
              <Input type="password" className="h-10" placeholder="smsbus_password" value={form.smsbus_password} onChange={(e) => updateForm("smsbus_password", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Terminal Web ID</label>
              <Input className="h-10" placeholder="smsbus_id" value={form.smsbus_id} onChange={(e) => updateForm("smsbus_id", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sender ID</label>
              <Input className="h-10" placeholder="Ex: MonEntreprise" value={form.smsbus_sender_id} onChange={(e) => updateForm("smsbus_sender_id", e.target.value)} />
            </div>
          </div>

          <Separator />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Compte propriétaire</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Prénom *</label>
              <Input className="h-10" value={form.owner_first_name} onChange={(e) => updateForm("owner_first_name", e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Nom *</label>
              <Input className="h-10" value={form.owner_last_name} onChange={(e) => updateForm("owner_last_name", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Email propriétaire</label>
              <Input type="email" className="h-10" placeholder="Si différent" value={form.owner_email} onChange={(e) => updateForm("owner_email", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Mot de passe *</label>
              <Input type="password" className="h-10" value={form.owner_password} onChange={(e) => updateForm("owner_password", e.target.value)} required />
            </div>
          </div>

          <Separator />
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Créer l'entreprise
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TenantStatsModal({ tenant, onClose }: { tenant: any; onClose: () => void }) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getTenantStats(tenant.id)
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [tenant.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-background rounded-2xl border border-border shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Statistiques — {tenant.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{tenant.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : stats ? (
            <div className="space-y-6">
              {/* Info entreprise */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                  <Building2 className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{stats.tenant.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Plan {stats.tenant.plan} • {stats.tenant.sms_provider.toUpperCase()} • {stats.tenant.sms_credits.toLocaleString()} crédits
                  </p>
                </div>
                <Badge variant="outline" className={cn("text-xs",
                  stats.tenant.is_active ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" : "bg-red-500/10 text-red-500 border-red-200"
                )}>
                  {stats.tenant.is_active ? "Actif" : "Inactif"}
                </Badge>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <StatCard icon={Users} label="Utilisateurs" value={stats.users.total} color="text-blue-600" bgColor="bg-blue-500/10" />
                <StatCard icon={Users} label="Contacts" value={stats.contacts.total} color="text-purple-600" bgColor="bg-purple-500/10"
                  subtitle={`${stats.contacts.subscribed} abonnés`} />
                <StatCard icon={MessageSquare} label="Messages" value={stats.messages.total} color="text-cyan-600" bgColor="bg-cyan-500/10"
                  subtitle={`${stats.messages.delivery_rate}% délivré`} />
                <StatCard icon={Target} label="Campagnes" value={stats.campaigns.total} color="text-amber-600" bgColor="bg-amber-500/10"
                  subtitle={`${stats.campaigns.sent} envoyées`} />
                <StatCard icon={CheckCircle2} label="Délivrés" value={stats.messages.delivered} color="text-emerald-600" bgColor="bg-emerald-500/10" />
                <StatCard icon={XCircle} label="Échoués" value={stats.messages.failed} color="text-red-500" bgColor="bg-red-500/10" />
              </div>

              {/* Détail contacts */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Détail contacts</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-border/50 text-center">
                    <p className="text-lg font-bold text-foreground">{stats.contacts.total}</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/50 text-center">
                    <p className="text-lg font-bold text-emerald-600">{stats.contacts.subscribed}</p>
                    <p className="text-[10px] text-muted-foreground">Abonnés</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/50 text-center">
                    <p className="text-lg font-bold text-red-500">{stats.contacts.unsubscribed}</p>
                    <p className="text-[10px] text-muted-foreground">Désinscrits</p>
                  </div>
                </div>
              </div>

              {/* Groupes */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <span className="text-sm text-muted-foreground">Groupes de contacts</span>
                <span className="text-sm font-semibold text-foreground">{stats.groups.total}</span>
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">Impossible de charger les statistiques</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bgColor, subtitle }: {
  icon: any; label: string; value: number; color: string; bgColor: string; subtitle?: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-border/50 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", bgColor)}>
          <Icon className={cn("h-4 w-4", color)} />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{value.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">{label}</p>
          {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}


function EditTenantModal({ tenant, onClose, onSaved }: { tenant: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: tenant.name || "",
    email: tenant.email || "",
    phone: tenant.phone || "",
    smsbus_username: tenant.smsbus_username || "",
    smsbus_password: "",
    smsbus_id: tenant.smsbus_id || "",
    smsbus_sender_id: tenant.smsbus_sender_id || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const updateForm = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      // Ne pas envoyer le password s'il est vide
      const data: any = { ...form };
      if (!data.smsbus_password) delete data.smsbus_password;
      await api.updateAdminTenant(tenant.id, data);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur");
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl mx-4 bg-background rounded-2xl border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
          <h3 className="text-lg font-semibold">Modifier — {tenant.name}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {error && <div className="p-3 rounded-lg bg-destructive/10 text-sm text-destructive">{error}</div>}

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Informations entreprise</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nom</label>
              <Input className="h-10" value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" className="h-10" value={form.email} onChange={(e) => updateForm("email", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Téléphone</label>
            <Input className="h-10" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} />
          </div>

          <Separator />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paramètres API SMS</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Username</label>
              <Input className="h-10" value={form.smsbus_username} onChange={(e) => updateForm("smsbus_username", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" className="h-10" placeholder="Laisser vide pour ne pas changer" value={form.smsbus_password} onChange={(e) => updateForm("smsbus_password", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Terminal Web ID</label>
              <Input className="h-10" value={form.smsbus_id} onChange={(e) => updateForm("smsbus_id", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sender ID</label>
              <Input className="h-10" value={form.smsbus_sender_id} onChange={(e) => updateForm("smsbus_sender_id", e.target.value)} />
            </div>
          </div>

          <Separator />
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit className="mr-2 h-4 w-4" />}
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
