import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Map,
  Navigation,
  Globe2,
  Save,
  Loader2,
  Trash2,
  Building2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ConfirmModal from "@/components/common/ConfirmModal";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

export function CityManagementModal({
  isOpen,
  onClose,
  cities,
  isLoading,
  onAddCity,
  onDeleteCity,
}) {
  // Form State
  const [name, setName] = useState("");
  const [stateName, setStateName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Google Places Autocomplete Ref
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Load Google Maps Script if API key is present
  useEffect(() => {
    // Suppress Google Maps authentication failure alerts that pop up as 'This page can't load Google Maps correctly'
    window.gm_authFailure = () => {
      console.warn("Google Maps authentication failed. Please check your API key and billing status.");
    };

    if (!GOOGLE_API_KEY) return;

    if (window.google && window.google.maps && window.google.maps.places) {
      setIsGoogleLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsGoogleLoaded(true);
      script.onerror = (err) => console.error("Google Maps script failed to load", err);
      document.body.appendChild(script);
    } else {
      setIsGoogleLoaded(true);
    }
  }, []);

  // Helper to initialize autocomplete on an input element
  const initAutocomplete = useCallback((inputElement) => {
    if (!inputElement || !window.google?.maps?.places || autocompleteRef.current) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputElement,
        {
          types: ["(cities)"],
          componentRestrictions: { country: "au" },
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry && place.geometry.location) {
          const placeLat = place.geometry.location.lat();
          const placeLng = place.geometry.location.lng();

          let state = "";
          let city = place.name;

          for (const component of place.address_components) {
            if (component.types.includes("administrative_area_level_1")) {
              state = component.short_name;
            }
          }

          setName(city);
          setStateName(state);
          setLat(placeLat.toFixed(6));
          setLng(placeLng.toFixed(6));
        }
      });
    } catch (err) {
      console.error("Error initializing Google Places Autocomplete:", err);
    }
  }, []);

  // Callback ref: fires when the input DOM element mounts/unmounts
  const cityInputRef = useCallback((node) => {
    inputRef.current = node;
    if (node && isGoogleLoaded) {
      initAutocomplete(node);
    }
  }, [isGoogleLoaded, initAutocomplete]);

  // Cleanup autocomplete when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
      
      // Remove any lingering pac-container elements (Google Places Autocomplete leaves these behind)
      const pacContainers = document.querySelectorAll('.pac-container');
      pacContainers.forEach(container => container.remove());
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !stateName || !lat || !lng) {
      toast.error("All fields are required");
      return;
    }

    const numLat = Number(lat);
    const numLng = Number(lng);

    // Bounding Box Validation for Australia
    if (numLat > -9 || numLat < -45 || numLng < 112 || numLng > 155) {
      toast.error("Coordinates must be within Australia bounds.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddCity({
        name,
        state: stateName,
        lat: numLat,
        lng: numLng,
      });
      toast.success("City added successfully");
      // Reset form
      setName("");
      setStateName("");
      setLat("");
      setLng("");
    } catch (error) {
      toast.error(error || "Failed to add city");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDeleteCity(deleteId);
      toast.success("City deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete city");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      {/* <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open && !isSubmitting && !isDeleting && !deleteId) {
          onClose();
        }
      }}> */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open && !isSubmitting && !isDeleting) {
          setDeleteId(null); // Agar cross dabaya toh delete process cancel kar do
          onClose();
        }
      }}>
        <DialogContent
          onInteractOutside={(e) => {
            const target = e.target;
            if (deleteId || (target?.closest && target.closest(".pac-container"))) {
              e.preventDefault();
            }
          }}
          onPointerDownOutside={(e) => {
            const target = e.target;
            if (deleteId || (target?.closest && target.closest(".pac-container"))) {
              e.preventDefault();
            }
          }}
          onFocusOutside={(e) => {
            const target = e.target;
            if (deleteId || (target?.closest && target.closest(".pac-container"))) {
              e.preventDefault();
            }
          }}
          className="sm:max-w-[600px] h-[85vh] sm:h-[750px] max-h-[90vh] gap-0 p-0 border-none shadow-2xl rounded-2xl overflow-hidden bg-slate-50 flex flex-col"
        >
          {/* ── Header ── */}
          <DialogHeader className="px-7 pt-7 pb-5 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-aqua/10 border border-brand-aqua/20">
                <MapPin className="h-6 w-6 text-brand-aqua" />
              </div>
              <div className="flex flex-col gap-0.5 text-left">
                <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Manage Cities
                </DialogTitle>
                <DialogDescription className="text-[12px] text-slate-500 font-medium">
                  Add custom Australian cities for fake profile generation.
                </DialogDescription>
              </div>
            </div>
            {/* Close button handled by Dialog primitive automatically, but we can override if needed */}
          </DialogHeader>

          <div className="flex flex-col overflow-hidden">
            {/* ── Add City Form ── */}
            <div className="p-6 bg-white border-b border-slate-100 shrink-0 shadow-sm z-10">
              <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-aqua" />
                Add New City
                {GOOGLE_API_KEY && (
                  <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px]">
                    Google Places Active
                  </Badge>
                )}
              </h4>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      City Name <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        ref={cityInputRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={GOOGLE_API_KEY ? "Start typing to search..." : "e.g. Newcastle"}
                        className="h-11 pl-10 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-brand-aqua"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      State <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="e.g. NSW"
                        className="h-11 pl-10 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-brand-aqua"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Latitude <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Globe2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="number"
                        step="any"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder="-32.9283"
                        className="h-11 pl-10 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-brand-aqua"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Longitude <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="number"
                        step="any"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        placeholder="151.7817"
                        className="h-11 pl-10 text-sm font-medium rounded-md border-slate-300 shadow-none focus-visible:border-brand-aqua"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-aqua hover:bg-brand-hoverAqua text-white text-[13px] font-bold h-10 px-6 rounded-md shadow-sm gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Add City
                  </Button>
                </div>
              </form>
            </div>

            {/* ── City List ── */}
            <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/50">
              <div className="px-6 py-4 flex items-center justify-between shrink-0">
                <h4 className="text-sm font-bold text-slate-700">Available Cities</h4>
                <Badge variant="outline" className="text-[10px] font-bold bg-white">
                  {cities?.length || 0} Total
                </Badge>
              </div>

              <ScrollArea className="flex-1 px-6 pb-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-aqua" />
                  </div>
                ) : cities?.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    No cities found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                    {cities?.map((c) => (
                      <div
                        key={c._id || c.name}
                        className="bg-white border border-slate-200 rounded-xl p-4 flex items-start justify-between shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm">{c.name}</span>
                            {c.isDefault ? (
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-slate-100 text-slate-500 border-slate-200 uppercase tracking-wider">
                                Default
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-brand-aqua/10 text-brand-aqua border-brand-aqua/20 uppercase tracking-wider">
                                Custom
                              </Badge>
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500">{c.state || "AU"}</span>
                          <span className="text-[10px] text-slate-400 mt-1 font-mono">
                            {c.lat}, {c.lng}
                          </span>
                        </div>

                        {/* {!c.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(c._id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )} */}

                        {!c.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation(); // Event bubbling rokne ke liye

                              const cityId = c._id || c.id; // Agar _id nahi hai toh id use karein

                              if (!cityId) {
                                toast.error("Error: City ID not found!");
                                return;
                              }

                              setDeleteId(cityId);
                            }}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => !isDeleting && setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete City?"
        message="Are you sure you want to delete this city? It will no longer be available for fake profile generation."
        confirmText="Delete City"
        type="danger"
        loading={isDeleting}
      />
    </>
  );
}
