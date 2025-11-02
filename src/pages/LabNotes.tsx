import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FileText, Search, Plus, Share2, Mic, Sparkles, Settings, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LabNote {
  labId: string;
  title: string;
  branch: string;
  date: string;
  note: string;
}

const mockNotes: LabNote[] = [
  { labId: "ece-001", title: "Circuit Basics", branch: "ECE", date: "01/11/2025", note: "Tested 5V circuits. Resistance calculations were accurate. Need to review parallel circuits." },
  { labId: "mech-002", title: "Mechanics Lab", branch: "Mechanical", date: "29/10/2025", note: "Force measurements completed successfully. Spring constant verified." },
  { labId: "chem-003", title: "Chemical Reactions", branch: "Chemistry", date: "28/10/2025", note: "Exothermic reaction observed. Safety protocols followed correctly." },
  { labId: "ece-004", title: "Digital Logic", branch: "ECE", date: "27/10/2025", note: "AND gate implementation perfect. OR gate needs review." },
  { labId: "civil-005", title: "Structural Analysis", branch: "Civil", date: "26/10/2025", note: "Load distribution calculations match theory. Beam deflection measured." },
  { labId: "chem-006", title: "Organic Chemistry", branch: "Chemistry", date: "25/10/2025", note: "Synthesis completed. Product yield 85%. Good results." },
  { labId: "mech-007", title: "Thermodynamics", branch: "Mechanical", date: "24/10/2025", note: "Heat transfer experiment. Need to improve insulation setup." },
  { labId: "ece-008", title: "Microprocessors", branch: "ECE", date: "23/10/2025", note: "Assembly code executed successfully. Timing optimization needed." },
  { labId: "civil-009", title: "Surveying", branch: "Civil", date: "22/10/2025", note: "Theodolite readings accurate. GPS calibration perfect." },
  { labId: "chem-010", title: "Inorganic Chemistry", branch: "Chemistry", date: "21/10/2025", note: "Precipitation reaction completed. Crystal formation observed." },
];

const LabNotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notes, setNotes] = useState<LabNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<LabNote[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("All");
  const [sortBy, setSortBy] = useState("Date");
  const [selectedNote, setSelectedNote] = useState<LabNote | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticIntensity, setHapticIntensity] = useState(1);
  const [robotState, setRobotState] = useState<"idle" | "writing" | "pinning" | "scanning">("idle");
  const [editedNote, setEditedNote] = useState("");
  const [newNote, setNewNote] = useState({ labId: "", note: "" });

  useEffect(() => {
    const savedNotes = localStorage.getItem("labNotes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      setNotes(mockNotes);
      localStorage.setItem("labNotes", JSON.stringify(mockNotes));
    }
  }, []);

  useEffect(() => {
    let filtered = notes;
    
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.note.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterBy !== "All") {
      if (filterBy === "Recent") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(n => new Date(n.date) >= weekAgo);
      } else {
        filtered = filtered.filter(n => n.branch === filterBy);
      }
    }

    if (sortBy === "Date") {
      filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "Title") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredNotes(filtered);
  }, [searchQuery, filterBy, sortBy, notes]);

  const triggerHaptic = () => {
    if (navigator.vibrate && hapticIntensity > 0) {
      navigator.vibrate([50 * hapticIntensity]);
    }
  };

  const handleEditNote = (note: LabNote) => {
    triggerHaptic();
    setSelectedNote(note);
    setEditedNote(note.note);
    setShowEditModal(true);
    setRobotState("pinning");
    setTimeout(() => setRobotState("idle"), 800);
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      triggerHaptic();
      const updatedNotes = notes.map(n => 
        n.labId === selectedNote.labId ? { ...n, note: editedNote } : n
      );
      setNotes(updatedNotes);
      localStorage.setItem("labNotes", JSON.stringify(updatedNotes));
      setShowEditModal(false);
      toast({ title: "Note Saved!", description: "Your note has been updated" });
      setRobotState("idle");
    }
  };

  const handleNewNote = () => {
    triggerHaptic();
    setShowNewNoteModal(true);
    setRobotState("writing");
    setTimeout(() => setRobotState("idle"), 800);
  };

  const handleCreateNote = () => {
    if (newNote.labId && newNote.note) {
      triggerHaptic();
      const lab = mockNotes.find(n => n.labId === newNote.labId);
      if (lab) {
        const newNoteEntry = {
          ...lab,
          note: newNote.note,
          date: new Date().toLocaleDateString('en-GB')
        };
        const updatedNotes = [newNoteEntry, ...notes];
        setNotes(updatedNotes);
        localStorage.setItem("labNotes", JSON.stringify(updatedNotes));
        setShowNewNoteModal(false);
        setNewNote({ labId: "", note: "" });
        toast({ title: "Note Created!", description: "New note added successfully" });
      }
    }
  };

  const handleFilterChange = (value: string) => {
    triggerHaptic();
    setFilterBy(value);
    setRobotState("scanning");
    setTimeout(() => setRobotState("idle"), 1000);
  };

  const handleSortChange = (value: string) => {
    triggerHaptic();
    setSortBy(value);
  };

  const handleShare = () => {
    triggerHaptic();
    toast({ title: "Note Shared!", description: "Your note has been shared" });
  };

  const handleVoiceNotes = () => {
    triggerHaptic();
    toast({ title: "Voice Notes", description: "Voice notes coming soon!" });
  };

  const handleMentorNotes = () => {
    triggerHaptic();
    toast({ title: "Mentor Notes", description: "Opening mentor suggestions..." });
  };

  const branches = ["All", "Recent", ...Array.from(new Set(mockNotes.map(n => n.branch)))];
  const keywords = ["Circuit", "Force", "Reaction", "Logic", "Load", "Heat", "Assembly", "GPS"];

  return (
    <div className="min-h-screen bg-background relative" style={{ fontSize: `${fontSize}px`, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 9px, hsl(var(--muted)/0.1) 9px, hsl(var(--muted)/0.1) 10px)" }}>
      <div className="container max-w-6xl py-8 px-4 space-y-6">
        {/* Header */}
        <div className="space-y-2 vlx-fade-in">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold relative inline-block">
              Your Lab Notes
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-[scale-in_0.3s_ease-out]" />
            </h1>
            <Button variant="ghost" size="icon" onClick={() => setShowAccessibility(true)} aria-label="Accessibility settings">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-muted-foreground">Document your experimental insights</p>
        </div>

        {/* Robot Assistant */}
        <div className={`fixed bottom-24 right-4 z-40 transition-transform duration-300 ${robotState === "writing" ? "animate-vlx-bounce" : ""}`}>
          <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary flex items-center justify-center ${robotState === "pinning" ? "scale-110" : ""}`}>
            <FileText className={`h-6 w-6 text-primary ${robotState === "scanning" ? "animate-vlx-spin" : ""}`} />
          </div>
          {robotState === "writing" && (
            <div className="absolute -left-16 top-0 animate-fade-in">
              <div className="w-8 h-0.5 bg-primary origin-right animate-[scale-x_0.4s_ease-out]" />
            </div>
          )}
        </div>

        {/* Search and Controls */}
        <div className="space-y-4 vlx-slide-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 focus:border-primary focus:shadow-[0_0_8px_rgba(0,123,255,0.3)] transition-all"
              aria-label="Search notes"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] space-y-2">
              <Label htmlFor="filter">Filter By</Label>
              <Select value={filterBy} onValueChange={handleFilterChange}>
                <SelectTrigger id="filter" aria-label="Filter notes">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px] space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger id="sort" aria-label="Sort notes">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Date">Date (Recent First)</SelectItem>
                  <SelectItem value="Title">Lab Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 vlx-slide-up" style={{ animationDelay: "0.1s" }}>
          <Button onClick={handleNewNote}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Note
          </Button>
          <Button variant="outline" onClick={handleVoiceNotes}>
            <Mic className="mr-2 h-4 w-4" />
            Voice Notes
          </Button>
          <Button variant="outline" onClick={handleMentorNotes}>
            <Sparkles className="mr-2 h-4 w-4" />
            Mentor Notes
          </Button>
          <Button variant="outline" onClick={() => setShowSummary(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Note Summary
          </Button>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16 vlx-fade-in">
            <div className="mb-6">
              <div className="inline-block w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center animate-vlx-bounce">
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Start Taking Notes</h3>
            <p className="text-muted-foreground mb-6">Document your lab experiments</p>
            <Button onClick={() => navigate("/labs")}>Explore Labs</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotes.map((note, index) => (
              <Card
                key={`${note.labId}-${index}`}
                className="p-6 hover:shadow-lg transition-all duration-300 vlx-slide-right cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleEditNote(note)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{note.title}</h3>
                      <p className="text-sm text-muted-foreground">{note.branch} • {note.date}</p>
                    </div>
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{note.note}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Note Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl" aria-describedby="edit-description">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:shadow-[0_0_8px_rgba(0,123,255,0.6)] active:rotate-45"
              onClick={() => setShowEditModal(false)}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {selectedNote && (
            <div className="space-y-4" id="edit-description">
              <div>
                <h4 className="font-semibold mb-1">{selectedNote.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedNote.branch} • {selectedNote.date}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-text">Note Content</Label>
                <Textarea
                  id="note-text"
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  rows={8}
                  className="resize-none"
                  aria-label="Edit note content"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button onClick={handleSaveNote}>Save Note</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Note Modal */}
      <Dialog open={showNewNoteModal} onOpenChange={setShowNewNoteModal}>
        <DialogContent className="max-w-2xl" aria-describedby="new-note-description">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:shadow-[0_0_8px_rgba(0,123,255,0.6)] active:rotate-45"
              onClick={() => setShowNewNoteModal(false)}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4" id="new-note-description">
            <div className="space-y-2">
              <Label htmlFor="lab-select">Select Lab</Label>
              <Select value={newNote.labId} onValueChange={(value) => setNewNote({ ...newNote, labId: value })}>
                <SelectTrigger id="lab-select" aria-label="Select lab for note">
                  <SelectValue placeholder="Choose a lab..." />
                </SelectTrigger>
                <SelectContent>
                  {mockNotes.map(note => (
                    <SelectItem key={note.labId} value={note.labId}>{note.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-note-text">Note Content</Label>
              <Textarea
                id="new-note-text"
                value={newNote.note}
                onChange={(e) => setNewNote({ ...newNote, note: e.target.value })}
                rows={8}
                placeholder="Write your observations..."
                className="resize-none"
                aria-label="New note content"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNewNoteModal(false)}>Cancel</Button>
              <Button onClick={handleCreateNote} disabled={!newNote.labId || !newNote.note}>
                Create Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Summary Modal */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-md" aria-describedby="summary-description">
          <DialogHeader>
            <DialogTitle>Note Summary</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:shadow-[0_0_8px_rgba(0,123,255,0.6)] active:rotate-45"
              onClick={() => setShowSummary(false)}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4" id="summary-description">
            <p className="text-sm text-muted-foreground">Key terms from your notes</p>
            <div className="flex flex-wrap gap-3 justify-center p-6 bg-primary/5 rounded-lg">
              {keywords.map((word, index) => (
                <span
                  key={word}
                  className="px-4 py-2 bg-card border border-primary/20 rounded-full text-sm font-medium animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Accessibility Modal */}
      <Dialog open={showAccessibility} onOpenChange={setShowAccessibility}>
        <DialogContent className="max-w-md" aria-describedby="accessibility-description">
          <DialogHeader>
            <DialogTitle>Accessibility Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6" id="accessibility-description">
            <div className="space-y-2">
              <Label>Font Size: {fontSize}pt</Label>
              <Slider
                min={14}
                max={20}
                step={1}
                value={[fontSize]}
                onValueChange={(v) => setFontSize(v[0])}
                aria-label="Adjust font size"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="contrast">High Contrast</Label>
              <Switch
                id="contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
                aria-label="Toggle high contrast mode"
              />
            </div>
            <div className="space-y-2">
              <Label>Haptic Intensity: {hapticIntensity === 0 ? "Off" : hapticIntensity === 1 ? "Low" : "High"}</Label>
              <Slider
                min={0}
                max={2}
                step={1}
                value={[hapticIntensity]}
                onValueChange={(v) => setHapticIntensity(v[0])}
                aria-label="Adjust haptic feedback intensity"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabNotes;
