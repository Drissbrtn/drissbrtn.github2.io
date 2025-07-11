import React, { useState, useEffect } from "react";
import {
  Download,
  Database,
  Loader2,
  AlertCircle,
  CheckCircle,
  BarChart3,
  RefreshCw,
  FileText,
  Settings,
  Info,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const CSVGenerator = () => {
  const [formData, setFormData] = useState({
    secteur: "",
    nomFichier: "",
    colonnes: "",
    lignes: 500,
    includeNulls: true,
    format: "csv",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedData, setGeneratedData] = useState(null);
  const [preview, setPreview] = useState([]);
  const [stats, setStats] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState("generator");

  const secteurs = [
    "Jeux vidéo",
    "E-commerce",
    "Santé",
    "Finance",
    "Marketing",
    "Éducation",
    "Immobilier",
    "Sport",
    "Restauration",
    "Technologie",
    "RH",
    "Politique",
    "Social",
    "Environnement",
    "Transport",
  ];

  const secteurTemplates = {
    "Jeux vidéo": {
      colonnes: [
        "nom_jeu",
        "genre",
        "plateforme",
        "ventes_millions",
        "note_metacritic",
        "date_sortie",
        "developpeur",
        "prix_euros",
      ],
      generators: {
        nom_jeu: () =>
          [
            "The Legend of Zelda",
            "Super Mario Odyssey",
            "Fortnite",
            "Minecraft",
            "Animal Crossing",
            "Call of Duty",
            "FIFA 24",
            "Grand Theft Auto",
            "Cyberpunk 2077",
            "Elden Ring",
            "God of War",
            "Spider-Man",
            "Horizon Zero Dawn",
            "The Witcher 3",
            "Red Dead Redemption",
          ][Math.floor(Math.random() * 15)],
        genre: () =>
          [
            "Action-Aventure",
            "Plateforme",
            "Battle Royale",
            "Sandbox",
            "Simulation",
            "FPS",
            "Sport",
            "Monde Ouvert",
            "RPG",
            "Stratégie",
            "Course",
            "Puzzle",
          ][Math.floor(Math.random() * 12)],
        plateforme: () =>
          [
            "Nintendo Switch",
            "PlayStation 5",
            "Xbox Series X",
            "PC",
            "Mobile",
            "PlayStation 4",
            "Xbox One",
            "Steam Deck",
          ][Math.floor(Math.random() * 8)],
        ventes_millions: () => (Math.random() * 100 + 1).toFixed(1),
        note_metacritic: () => Math.floor(Math.random() * 30) + 70,
        date_sortie: () =>
          new Date(
            2020 + Math.floor(Math.random() * 5),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          )
            .toISOString()
            .split("T")[0],
        developpeur: () =>
          [
            "Nintendo",
            "Sony",
            "Microsoft",
            "Ubisoft",
            "Electronic Arts",
            "Activision",
            "Rockstar Games",
            "CD Projekt Red",
            "FromSoftware",
            "Naughty Dog",
          ][Math.floor(Math.random() * 10)],
        prix_euros: () => Math.round(Math.random() * 50 + 20),
      },
    },
    "E-commerce": {
      colonnes: [
        "nom_produit",
        "prix_euros",
        "stock_disponible",
        "categorie",
        "note_client",
        "nb_avis",
        "marque",
        "promotion_active",
      ],
      generators: {
        nom_produit: () =>
          [
            "iPhone 15 Pro",
            "Samsung Galaxy S24",
            "MacBook Air",
            "AirPods Pro",
            "Sony WH-1000XM5",
            "Dell XPS 13",
            "Nintendo Switch",
            "iPad Pro",
            "Surface Pro",
            "Google Pixel 8",
          ][Math.floor(Math.random() * 10)],
        prix_euros: () => Math.round(Math.random() * 2000 + 50),
        stock_disponible: () => Math.floor(Math.random() * 1000),
        categorie: () =>
          [
            "Électronique",
            "Informatique",
            "Audio",
            "Gaming",
            "Smartphone",
            "Ordinateur",
            "Tablette",
            "Accessoires",
          ][Math.floor(Math.random() * 8)],
        note_client: () => (Math.random() * 2 + 3).toFixed(1),
        nb_avis: () => Math.floor(Math.random() * 5000),
        marque: () =>
          ["Apple", "Samsung", "Sony", "Dell", "Microsoft", "Nintendo", "Bose", "Google"][
            Math.floor(Math.random() * 8)
          ],
        promotion_active: () => (Math.random() > 0.7 ? "Oui" : "Non"),
      },
    },
    Santé: {
      colonnes: [
        "patient_id",
        "age",
        "sexe",
        "diagnostic",
        "duree_hospitalisation",
        "cout_traitement",
        "medecin_referent",
        "urgence",
      ],
      generators: {
        patient_id: () => "PAT-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        age: () => Math.floor(Math.random() * 80) + 18,
        sexe: () => ["M", "F"][Math.floor(Math.random() * 2)],
        diagnostic: () =>
          [
            "Hypertension",
            "Diabète",
            "Fracture",
            "Infection",
            "Grippe",
            "Allergie",
            "Migraine",
            "Pneumonie",
            "Arthrite",
            "Asthme",
          ][Math.floor(Math.random() * 10)],
        duree_hospitalisation: () => Math.floor(Math.random() * 14) + 1,
        cout_traitement: () => Math.round(Math.random() * 5000 + 100),
        medecin_referent: () =>
          [
            "Dr. Dupont",
            "Dr. Martin",
            "Dr. Lefevre",
            "Dr. Bernard",
            "Dr. Petit",
            "Dr. Moreau",
            "Dr. Rousseau",
          ][Math.floor(Math.random() * 7)],
        urgence: () =>
          ["Faible", "Moyenne", "Haute"][Math.floor(Math.random() * 3)],
      },
    },
    Finance: {
      colonnes: [
        "transaction_id",
        "montant_euros",
        "type_operation",
        "date_transaction",
        "compte_emetteur",
        "compte_recepteur",
        "statut",
        "frais_bancaires",
      ],
      generators: {
        transaction_id: () => "TRX-" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
        montant_euros: () => (Math.random() * 5000 + 10).toFixed(2),
        type_operation: () =>
          ["Virement", "Prélèvement", "Carte", "Chèque", "Dépôt", "Retrait"][
            Math.floor(Math.random() * 6)
          ],
        date_transaction: () =>
          new Date(
            2023 + Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          )
            .toISOString()
            .split("T")[0],
        compte_emetteur: () =>
          "FR76" + Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0'),
        compte_recepteur: () =>
          "FR76" + Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0'),
        statut: () =>
          ["Complété", "En attente", "Rejeté", "Annulé"][Math.floor(Math.random() * 4)],
        frais_bancaires: () => (Math.random() * 10).toFixed(2),
      },
    },
    Marketing: {
      colonnes: [
        "campagne_id",
        "nom_campagne",
        "canal_marketing",
        "budget_euros",
        "impressions",
        "clics",
        "conversions",
        "cout_par_clic",
        "roi_pourcentage",
      ],
      generators: {
        campagne_id: () => "CAMP-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        nom_campagne: () =>
          [
            "Été 2024",
            "Black Friday",
            "Noël",
            "Soldes",
            "Nouvelle Collection",
            "Promo Flash",
            "Rentrée",
            "Saint-Valentin",
          ][Math.floor(Math.random() * 8)],
        canal_marketing: () =>
          [
            "Réseaux sociaux",
            "Email",
            "SEO",
            "Affichage",
            "Influenceurs",
            "TV",
            "Radio",
            "Presse",
          ][Math.floor(Math.random() * 8)],
        budget_euros: () => Math.round(Math.random() * 100000 + 1000),
        impressions: () => Math.floor(Math.random() * 1000000),
        clics: () => Math.floor(Math.random() * 10000),
        conversions: () => Math.floor(Math.random() * 500),
        cout_par_clic: () => (Math.random() * 5).toFixed(2),
        roi_pourcentage: () => (Math.random() * 500).toFixed(1),
      },
    },
  };

  useEffect(() => {
    if (formData.secteur) {
      const colonnesCount =
        secteurTemplates[formData.secteur]?.colonnes.length || 0;
      setFormData((prev) => ({
        ...prev,
        colonnes: colonnesCount,
      }));
    }
  }, [formData.secteur]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateData = () => {
    if (!formData.secteur || !secteurTemplates[formData.secteur]) {
      throw new Error("Secteur non valide");
    }

    const template = secteurTemplates[formData.secteur];
    const donnees = [];

    for (let i = 0; i < formData.lignes; i++) {
      const row = template.colonnes.map((col) => {
        if (formData.includeNulls && Math.random() < 0.025) return null;
        return template.generators[col]
          ? template.generators[col]()
          : `Valeur ${i}`;
      });
      donnees.push(row);
    }

    return {
      colonnes: template.colonnes,
      donnees: donnees,
      contexte_analyse: `Données générées pour le secteur ${formData.secteur}`,
    };
  };

  const convertToCSV = (data) => {
    const { colonnes, donnees } = data;
    const csvLines = [colonnes.join(",")];

    donnees.forEach((row) => {
      const csvRow = row
        .map((value) => {
          if (value === null || value === undefined) return "";
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        })
        .join(",");
      csvLines.push(csvRow);
    });

    return csvLines.join("\n");
  };

  const convertToJSON = (data) => {
    const { colonnes, donnees } = data;
    const jsonData = donnees.map((row) => {
      const obj = {};
      colonnes.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
    return JSON.stringify(jsonData, null, 2);
  };

  const parseCSVForPreview = (csvData) => {
    const lines = csvData.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",");
    const rows = lines.slice(1, 11).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || "";
        return obj;
      }, {});
    });
    return { headers, rows };
  };

  const calculateStats = (data) => {
    const { colonnes, donnees } = data;
    const totalRows = donnees.length;
    const totalColumns = colonnes.length;

    let numericColumns = 0;
    let categoricalColumns = 0;
    let emptyValues = 0;

    colonnes.forEach((col, colIndex) => {
      const values = donnees.map((row) => row[colIndex]);
      const nonEmptyValues = values.filter(
        (v) => v !== null && v !== undefined && v !== ""
      );
      emptyValues += values.length - nonEmptyValues.length;

      if (nonEmptyValues.length > 0) {
        const isNumeric = nonEmptyValues.every(
          (v) => !isNaN(parseFloat(v)) && isFinite(v)
        );
        if (isNumeric) {
          numericColumns++;
        } else {
          categoricalColumns++;
        }
      }
    });

    return {
      totalRows,
      totalColumns,
      numericColumns,
      categoricalColumns,
      emptyValues,
      completeness: Math.round(
        (1 - emptyValues / (totalRows * totalColumns)) * 100
      ),
    };
  };

  const handleGenerate = () => {
    if (!formData.secteur) {
      setError("Veuillez sélectionner un secteur");
      return;
    }

    if (formData.lignes < 50 || formData.lignes > 10000) {
      setError("Le nombre de lignes doit être entre 50 et 10000");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = generateData();
      const csvData = convertToCSV(data);
      setGeneratedData({
        csv: csvData,
        json: convertToJSON(data),
        raw: data,
      });

      const { headers, rows } = parseCSVForPreview(csvData);
      setPreview(rows);

      const statistics = calculateStats(data);
      setStats(statistics);

      setSuccess(`Données ${formData.secteur} générées avec succès !`);
      setActiveTab("preview");
    } catch (error) {
      console.error("Erreur génération:", error);
      setError(`Erreur lors de la génération: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (generatedData) {
      handleGenerate();
    }
  };

  const downloadFile = () => {
    if (!generatedData) return;

    const dataToDownload = formData.format === "json" ? generatedData.json : generatedData.csv;
    const mimeType = formData.format === "json" ? "application/json" : "text/csv";
    const extension = formData.format === "json" ? "json" : "csv";

    const blob = new Blob([dataToDownload], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const fileName = formData.nomFichier
      ? `${formData.nomFichier}.${extension}`
      : `donnees_${formData.secteur.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${
          new Date().toISOString().split("T")[0]
        }_${Date.now()}.${extension}`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!generatedData) return;
    
    const dataToCopy = formData.format === "json" ? generatedData.json : generatedData.csv;
    
    try {
      await navigator.clipboard.writeText(dataToCopy);
      setSuccess("Données copiées dans le presse-papiers !");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erreur lors de la copie");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Database className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">
                  Générateur de CSV Avancé
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Créez des jeux de données fictifs professionnels pour vos projets
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="generator" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configuration
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!generatedData}>
                  <Eye className="w-4 h-4" />
                  Aperçu
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2" disabled={!stats}>
                  <BarChart3 className="w-4 h-4" />
                  Statistiques
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generator" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="secteur" className="text-sm font-semibold">
                        Secteur d'activité *
                      </Label>
                      <Select value={formData.secteur} onValueChange={(value) => handleSelectChange("secteur", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un secteur" />
                        </SelectTrigger>
                        <SelectContent>
                          {secteurs.map((secteur) => (
                            <SelectItem key={secteur} value={secteur}>
                              {secteur}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="nomFichier" className="text-sm font-semibold">
                        Nom du fichier (optionnel)
                      </Label>
                      <Input
                        id="nomFichier"
                        name="nomFichier"
                        value={formData.nomFichier}
                        onChange={handleInputChange}
                        placeholder="Ex: donnees_clients_2024"
                      />
                      <p className="text-xs text-muted-foreground">
                        Spécifiez un nom personnalisé pour le fichier (sans extension)
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="format" className="text-sm font-semibold">
                        Format de sortie
                      </Label>
                      <Select value={formData.format} onValueChange={(value) => handleSelectChange("format", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="colonnes" className="text-sm font-semibold">
                        Nombre de colonnes
                      </Label>
                      <Input
                        id="colonnes"
                        name="colonnes"
                        type="number"
                        value={formData.colonnes}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Déterminé automatiquement par le secteur sélectionné
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="lignes" className="text-sm font-semibold">
                        Nombre de lignes *
                      </Label>
                      <Input
                        id="lignes"
                        name="lignes"
                        type="number"
                        value={formData.lignes}
                        onChange={handleInputChange}
                        min="50"
                        max="10000"
                      />
                      <p className="text-xs text-muted-foreground">
                        Entre 50 et 10 000 lignes
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeNulls"
                        name="includeNulls"
                        checked={formData.includeNulls}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <Label htmlFor="includeNulls" className="text-sm">
                        Inclure des valeurs nulles (2.5% de chance)
                      </Label>
                    </div>
                  </div>
                </div>

                {formData.secteur && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        Colonnes du secteur {formData.secteur}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {secteurTemplates[formData.secteur]?.colonnes.map((col, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                            {col}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    size="lg"
                    className="flex-1 min-w-48 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Database className="w-5 h-5 mr-2" />
                        Générer les données
                      </>
                    )}
                  </Button>

                  {generatedData && (
                    <>
                      <Button
                        onClick={handleRegenerate}
                        disabled={loading}
                        variant="outline"
                        size="lg"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        Régénérer
                      </Button>
                      <Button
                        onClick={downloadFile}
                        disabled={loading}
                        size="lg"
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Télécharger {formData.format.toUpperCase()}
                      </Button>
                      <Button
                        onClick={copyToClipboard}
                        disabled={loading}
                        variant="outline"
                        size="lg"
                      >
                        <Copy className="w-5 h-5 mr-2" />
                        Copier
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                {generatedData && (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Aperçu des données</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {showPreview ? "Masquer" : "Afficher"}
                        </Button>
                      </div>
                    </div>

                    {showPreview && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Premières lignes (format {formData.format.toUpperCase()})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {formData.format === "csv" ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse border border-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    {preview[0] &&
                                      Object.keys(preview[0]).map((header, index) => (
                                        <th
                                          key={index}
                                          className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                                        >
                                          {header}
                                        </th>
                                      ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {preview.map((row, rowIndex) => (
                                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                      {Object.values(row).map((value, colIndex) => (
                                        <td
                                          key={colIndex}
                                          className="border border-gray-200 px-4 py-2 text-sm text-gray-700"
                                        >
                                          {value === null || value === "" ? (
                                            <span className="text-gray-400 italic">null</span>
                                          ) : (
                                            value
                                          )}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                              {JSON.stringify(preview, null, 2)}
                            </pre>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                {stats && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        Statistiques du jeu de données
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Lignes</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {stats.totalRows.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Colonnes</p>
                          <p className="text-3xl font-bold text-green-600">
                            {stats.totalColumns}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Numériques</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {stats.numericColumns}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Catégorielles</p>
                          <p className="text-3xl font-bold text-orange-600">
                            {stats.categoricalColumns}
                          </p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Complétude</p>
                          <p className="text-3xl font-bold text-red-600">
                            {stats.completeness}%
                          </p>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Informations générales</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Total de cellules: {(stats.totalRows * stats.totalColumns).toLocaleString()}</li>
                            <li>• Valeurs vides: {stats.emptyValues.toLocaleString()}</li>
                            <li>• Secteur: {formData.secteur}</li>
                            <li>• Format: {formData.format.toUpperCase()}</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Qualité des données</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Taux de complétude: {stats.completeness}%</li>
                            <li>• Colonnes avec données: {stats.numericColumns + stats.categoricalColumns}</li>
                            <li>• Ratio numérique/catégoriel: {stats.numericColumns}:{stats.categoricalColumns}</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CSVGenerator;

