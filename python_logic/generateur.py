#env python
# coding: utf-8 

import random
import csv
import datetime
import argparse
import sys
from pathlib import Path


#  Aides pour les générateurs

def random_date(start_year, years_range):
    """Génère une date ISO aléatoire."""
    year = start_year + random.randint(0, years_range - 1)
    month = random.randint(1, 12)
    day = random.randint(1, 28)  
    return datetime.date(year, month, day).isoformat()


def random_id(prefix, max_num=10000):
    """Génère un ID aléatoire."""
    return f"{prefix}-{random.randint(1, max_num)}"


# Définition des Templates (secteurs) 

SECTEUR_TEMPLATES = {
    "Jeux vidéo": {
        "colonnes": [
            "nom_jeu", "genre", "plateforme", "ventes_millions",
            "note_metacritic", "date_sortie", "developpeur", "prix_euros",
        ],
        "generators": {
            "nom_jeu": lambda: random.choice([
                "The Legend of Zelda", "Super Mario Odyssey", "Fortnite", "Minecraft",
                "Animal Crossing", "Call of Duty", "FIFA 24", "Grand Theft Auto",
            ]),
            "genre": lambda: random.choice([
                "Action-Aventure", "Plateforme", "Battle Royale", "Sandbox",
                "Simulation", "FPS", "Sport", "Monde Ouvert",
            ]),
            "plateforme": lambda: random.choice([
                "Nintendo Switch", "PlayStation 5", "Xbox Series X", "PC", "Mobile", "PlayStation 4",
            ]),
            "ventes_millions": lambda: f"{(random.random() * 100 + 1):.1f}",
            "note_metacritic": lambda: random.randint(70, 100),
            "date_sortie": lambda: random_date(2020, 5),
            "developpeur": lambda: random.choice([
                "Nintendo", "Sony", "Microsoft", "Ubisoft", "Electronic Arts", "Activision", "Rockstar Games",
            ]),
            "prix_euros": lambda: round(random.random() * 50 + 20),
        },
    },
    "E-commerce": {
        "colonnes": [
            "nom_produit", "prix_euros", "stock_disponible", "categorie",
            "note_client", "nb_avis", "marque", "promotion_active",
        ],
        "generators": {
            "nom_produit": lambda: random.choice([
                "iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Air", "AirPods Pro",
                "Sony WH-1000XM5", "Dell XPS 13", "Nintendo Switch",
            ]),
            "prix_euros": lambda: round(random.random() * 2000 + 50),
            "stock_disponible": lambda: random.randint(0, 999),
            "categorie": lambda: random.choice([
                "Électronique", "Informatique", "Audio", "Gaming", "Smartphone", "Ordinateur",
            ]),
            "note_client": lambda: f"{(random.random() * 2 + 3):.1f}",
            "nb_avis": lambda: random.randint(0, 4999),
            "marque": lambda: random.choice(["Apple", "Samsung", "Sony", "Dell", "Microsoft", "Nintendo", "Bose"]),
            "promotion_active": lambda: "Oui" if random.random() > 0.7 else "Non",
        },
    },
    "Santé": {
        "colonnes": [
            "patient_id", "age", "sexe", "diagnostic", "duree_hospitalisation",
            "cout_traitement", "medecin_referent", "urgence",
        ],
        "generators": {
            "patient_id": lambda: random_id("PAT", 10000),
            "age": lambda: random.randint(18, 97),
            "sexe": lambda: random.choice(["M", "F"]),
            "diagnostic": lambda: random.choice([
                "Hypertension", "Diabète", "Fracture", "Infection", "Grippe", "Allergie", "Migraine",
            ]),
            "duree_hospitalisation": lambda: random.randint(1, 15),
            "cout_traitement": lambda: round(random.random() * 5000 + 100),
            "medecin_referent": lambda: random.choice([
                "Dr. Dupont", "Dr. Martin", "Dr. Lefevre", "Dr. Bernard", "Dr. Petit",
            ]),
            "urgence": lambda: random.choice(["Faible", "Moyenne", "Haute"]),
        },
    },
    "Finance": {
        "colonnes": [
            "transaction_id", "montant_euros", "type_operation", "date_transaction",
            "compte_emetteur", "compte_recepteur", "statut", "frais_bancaires",
        ],
        "generators": {
            "transaction_id": lambda: random_id("TRX", 1000000),
            "montant_euros": lambda: f"{(random.random() * 5000 + 10):.2f}",
            "type_operation": lambda: random.choice(["Virement", "Prélèvement", "Carte", "Chèque", "Dépôt"]),
            "date_transaction": lambda: random_date(2023, 1),
            "compte_emetteur": lambda: "FR76" + str(random.randint(10 ** 14, 10 ** 15 - 1)),
            "compte_recepteur": lambda: "FR76" + str(random.randint(10 ** 14, 10 ** 15 - 1)),
            "statut": lambda: random.choice(["Complété", "En attente", "Rejeté"]),
            "frais_bancaires": lambda: f"{(random.random() * 10):.2f}",
        },
    },
    "Marketing": {
        "colonnes": [
            "campagne_id", "nom_campagne", "canal_marketing", "budget_euros",
            "impressions", "clics", "conversions", "cout_par_clic", "roi_pourcentage",
        ],
        "generators": {
            "campagne_id": lambda: random_id("CAMP", 10000),
            "nom_campagne": lambda: random.choice([
                "Été 2023", "Black Friday", "Noël", "Soldes", "Nouvelle Collection", "Promo Flash",
            ]),
            "canal_marketing": lambda: random.choice([
                "Réseaux sociaux", "Email", "SEO", "Affichage", "Influenceurs", "TV",
            ]),
            "budget_euros": lambda: round(random.random() * 100000 + 1000),
            "impressions": lambda: random.randint(0, 999999),
            "clics": lambda: random.randint(0, 9999),
            "conversions": lambda: random.randint(0, 499),
            "cout_par_clic": lambda: f"{(random.random() * 5):.2f}",
            "roi_pourcentage": lambda: f"{(random.random() * 500):.1f}",
        },
    },
    "Éducation": {
        "colonnes": [
            "etudiant_id", "nom", "niveau_etude", "matiere_principale",
            "note_moyenne", "absences", "frais_scolarite", "bourse_obtenue",
        ],
        "generators": {
            "etudiant_id": lambda: random_id("ETU", 10000),
            "nom": lambda: f"{random.choice(['Dupont', 'Martin', 'Bernard', 'Petit', 'Durand', 'Leroy'])} {random.choice(['Jean', 'Marie', 'Pierre', 'Sophie', 'Thomas', 'Laura'])}",
            "niveau_etude": lambda: random.choice([
                "Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2", "Doctorat",
            ]),
            "matiere_principale": lambda: random.choice([
                "Mathématiques", "Histoire", "Informatique", "Biologie", "Droit", "Économie",
            ]),
            "note_moyenne": lambda: f"{(random.random() * 10 + 5):.1f}",
            "absences": lambda: random.randint(0, 29),
            "frais_scolarite": lambda: round(random.random() * 5000 + 500),
            "bourse_obtenue": lambda: "Oui" if random.random() > 0.7 else "Non",
        },
    },
    "Immobilier": {
        "colonnes": [
            "bien_id", "type_bien", "ville", "quartier", "prix_euros",
            "surface_m2", "nb_pieces", "annee_construction", "classe_energetique",
        ],
        "generators": {
            "bien_id": lambda: random_id("BIEN", 10000),
            "type_bien": lambda: random.choice(["Appartement", "Maison", "Loft", "Studio", "Villa"]),
            "ville": lambda: random.choice(["Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Nantes"]),
            "quartier": lambda: random.choice(
                ["Centre-ville", "Périphérie", "Résidentiel", "Commercial", "Historique"]),
            "prix_euros": lambda: round(random.random() * 1000000 + 50000),
            "surface_m2": lambda: round(random.random() * 200 + 30),
            "nb_pieces": lambda: random.randint(1, 8),
            "annee_construction": lambda: random.randint(1970, 2019),
            "classe_energetique": lambda: random.choice(["A", "B", "C", "D", "E", "F", "G"]),
        },
    },
    "Sport": {
        "colonnes": [
            "joueur_id", "nom", "poste", "age", "club", "salaire_annuel",
            "buts_marques", "matchs_joues", "valeur_marche",
        ],
        "generators": {
            "joueur_id": lambda: random_id("JOU", 10000),
            "nom": lambda: f"{random.choice(['Mbappé', 'Benzema', 'Griezmann', 'Pogba', 'Kante', 'Coman'])} {random.choice(['Kylian', 'Karim', 'Antoine', 'Paul', 'N\'Golo', 'Kingsley'])}",
            "poste": lambda: random.choice(["Attaquant", "Milieu", "Défenseur", "Gardien"]),
            "age": lambda: random.randint(18, 37),
            "club": lambda: random.choice(
                ["PSG", "Real Madrid", "Manchester United", "Bayern Munich", "Juventus", "Chelsea"]),
            "salaire_annuel": lambda: round(random.random() * 10000000 + 100000),
            "buts_marques": lambda: random.randint(0, 49),
            "matchs_joues": lambda: random.randint(0, 99),
            "valeur_marche": lambda: round(random.random() * 100000000 + 1000000),
        },
    },
    "Restauration": {
        "colonnes": [
            "restaurant_id", "nom", "cuisine_type", "prix_moyen", "note_google",
            "nb_avis", "ville", "livraison_disponible",
        ],
        "generators": {
            "restaurant_id": lambda: random_id("RES", 10000),
            "nom": lambda: random.choice([
                "Le Petit Bistrot", "La Table Ronde", "Chez Paul", "Sushi Palace", "Pasta Bella", "Burger Factory",
            ]),
            "cuisine_type": lambda: random.choice(
                ["Française", "Italienne", "Japonaise", "Américaine", "Libanaise", "Indienne"]),
            "prix_moyen": lambda: round(random.random() * 50 + 10),
            "note_google": lambda: f"{(random.random() * 2 + 3):.1f}",
            "nb_avis": lambda: random.randint(0, 499),
            "ville": lambda: random.choice(["Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Lille"]),
            "livraison_disponible": lambda: "Oui" if random.random() > 0.3 else "Non",
        },
    },
    "Technologie": {
        "colonnes": [
            "startup_id", "nom_entreprise", "secteur_activite", "financement_leve",
            "nb_employes", "chiffre_affaires", "ville_siege", "annee_creation",
        ],
        "generators": {
            "startup_id": lambda: random_id("ST", 10000),
            "nom_entreprise": lambda: random.choice([
                "TechSoft", "Innovate", "DataMind", "CloudNine", "AI Solutions", "Future Labs",
            ]),
            "secteur_activite": lambda: random.choice(["IA", "Blockchain", "SaaS", "IoT", "Cybersécurité", "Big Data"]),
            "financement_leve": lambda: round(random.random() * 5000000 + 100000),
            "nb_employes": lambda: random.randint(5, 204),
            "chiffre_affaires": lambda: round(random.random() * 10000000 + 50000),
            "ville_siege": lambda: random.choice(
                ["Paris", "San Francisco", "Berlin", "Londres", "Singapour", "Tel Aviv"]),
            "annee_creation": lambda: random.randint(2010, 2019),
        },
    },
    "RH": {
        "colonnes": [
            "employe_id", "nom", "poste", "salaire_annuel", "anciennete_annees",
            "departement", "evaluation_performance", "teletravail_jours",
        ],
        "generators": {
            "employe_id": lambda: random_id("EMP", 10000),
            "nom": lambda: f"{random.choice(['Dupont', 'Martin', 'Bernard', 'Petit', 'Durand', 'Leroy'])} {random.choice(['Jean', 'Marie', 'Pierre', 'Sophie', 'Thomas', 'Laura'])}",
            "poste": lambda: random.choice(["Développeur", "Manager", "Designer", "RH", "Commercial", "Comptable"]),
            "salaire_annuel": lambda: round(random.random() * 80000 + 30000),
            "anciennete_annees": lambda: random.randint(0, 14),
            "departement": lambda: random.choice(["IT", "Marketing", "Finance", "RH", "Production", "Ventes"]),
            "evaluation_performance": lambda: f"{(random.random() * 5 + 1):.1f}",
            "teletravail_jours": lambda: random.randint(0, 5),
        },
    },
    "Politique": {
        "colonnes": [
            "elu_id", "nom", "parti_politique", "ville", "nb_voix",
            "pourcentage_votes", "age", "profession_origine",
        ],
        "generators": {
            "elu_id": lambda: random_id("ELU", 10000),
            "nom": lambda: f"{random.choice(['Macron', 'Le Pen', 'Mélenchon', 'Pécresse', 'Jadot', 'Zemmour'])} {random.choice(['Emmanuel', 'Marine', 'Jean-Luc', 'Valérie', 'Yannick', 'Éric'])}",
            "parti_politique": lambda: random.choice(["LREM", "RN", "LFI", "LR", "EELV", "PS"]),
            "ville": lambda: random.choice(["Paris", "Lyon", "Marseille", "Nice", "Strasbourg", "Bordeaux"]),
            "nb_voix": lambda: random.randint(0, 49999),
            "pourcentage_votes": lambda: f"{(random.random() * 50):.1f}",
            "age": lambda: random.randint(35, 74),
            "profession_origine": lambda: random.choice([
                "Avocat", "Enseignant", "Cadre", "Médecin", "Fonctionnaire", "Chef d'entreprise",
            ]),
        },
    },
    "Social": {
        "colonnes": [
            "association_id", "nom", "domaine_action", "budget_annuel",
            "nb_benevoles", "nb_beneficiaires", "ville", "subventions_publiques",
        ],
        "generators": {
            "association_id": lambda: random_id("ASSO", 10000),
            "nom": lambda: random.choice([
                "Les Restos du Cœur", "Secours Populaire", "Emmaüs",
                "Croix-Rouge", "Médecins Sans Frontières", "UNICEF",
            ]),
            "domaine_action": lambda: random.choice([
                "Pauvreté", "Santé", "Éducation", "Logement", "Urgence", "Environnement",
            ]),
            "budget_annuel": lambda: round(random.random() * 1000000 + 50000),
            "nb_benevoles": lambda: random.randint(0, 499),
            "nb_beneficiaires": lambda: random.randint(0, 9999),
            "ville": lambda: random.choice(["Paris", "Lyon", "Marseille", "Lille", "Toulouse", "Nantes"]),
            "subventions_publiques": lambda: round(random.random() * 500000),
        },
    },
    "Environnement": {
        "colonnes": [
            "ville", "co2_tonnes", "qualite_air_indice", "temperature_moyenne",
            "precipitations_mm", "espaces_verts_pourcentage", "dechets_recycles",
        ],
        "generators": {
            "ville": lambda: random.choice(["Paris", "Lyon", "Marseille", "Bordeaux", "Strasbourg", "Nantes"]),
            "co2_tonnes": lambda: f"{(random.random() * 10000):.1f}",
            "qualite_air_indice": lambda: random.randint(1, 100),
            "temperature_moyenne": lambda: f"{(random.random() * 20 + 5):.1f}",
            "precipitations_mm": lambda: f"{(random.random() * 1000):.1f}",
            "espaces_verts_pourcentage": lambda: f"{(random.random() * 50):.1f}",
            "dechets_recycles": lambda: f"{(random.random() * 100):.1f}",
        },
    },
    "Transport": {
        "colonnes": [
            "ligne_id", "nom_ligne", "type_transport", "nb_stations",
            "frequence_minutes", "nb_passagers_jour", "tarif_euros", "longueur_km",
        ],
        "generators": {
            "ligne_id": lambda: random_id("LIG", 100),
            "nom_ligne": lambda: random.choice(["Ligne 1", "Ligne A", "Ligne B", "Ligne 2", "Ligne C", "Ligne 3"]),
            "type_transport": lambda: random.choice(["Métro", "Bus", "Tramway", "RER", "Train"]),
            "nb_stations": lambda: random.randint(5, 34),
            "frequence_minutes": lambda: random.randint(2, 21),
            "nb_passagers_jour": lambda: random.randint(0, 99999),
            "tarif_euros": lambda: f"{(random.random() * 5 + 1):.2f}",
            "longueur_km": lambda: f"{(random.random() * 50):.1f}",
        },
    },
}


def generate_data(secteur, nb_lignes):
    """Génère les données fictives pour un secteur."""
    if secteur not in SECTEUR_TEMPLATES:
        raise ValueError(f"Secteur '{secteur}' non valide.")

    template = SECTEUR_TEMPLATES[secteur]
    colonnes = template["colonnes"]
    generators = template["generators"]

    donnees = []
    for _ in range(nb_lignes):
        row = []
        for col in colonnes:
            #  2.5% de chance de valeur nulle 
            if random.random() < 0.025:
                row.append(None)  
            else:
                gen_func = generators.get(col)
                if gen_func:
                    row.append(gen_func())
                else:
                    row.append(None)  # Au cas où 
        donnees.append(row)

    return colonnes, donnees


def write_csv_file(headers, data, filename):
    """Écrit les données dans un fichier CSV."""

    filepath = Path(filename)

    # Ajoute .csv si non présent
    if filepath.suffix != ".csv":
        filepath = filepath.with_suffix(".csv")

    try:
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(data)

        print(f"✅ Fichier '{filepath}' généré avec succès !")

    except IOError as e:
        print(f"❌ Erreur lors de l'écriture du fichier: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    """Point d'entrée principal du script."""

    parser = argparse.ArgumentParser(
        description="Générateur de CSV de données fictives (basé sur la logique React).",
        formatter_class=argparse.RawTextHelpFormatter
    )

    parser.add_argument(
        "secteur",
        help="Secteur d'activité pour lequel générer des données.",
        choices=SECTEUR_TEMPLATES.keys()
    )

    parser.add_argument(
        "-l", "--lignes",
        type=int,
        default=500,
        help="Nombre de lignes à générer (défaut: 500). Doit être entre 50 et 5000."
    )

    parser.add_argument(
        "-o", "--output",
        dest="nom_fichier",
        help="Nom du fichier de sortie (optionnel). Ex: 'mes_donnees'"
    )

    args = parser.parse_args()

    # Validation du nombre de lignes
    if not 50 <= args.lignes <= 5000:
        print(f"Erreur: Le nombre de lignes doit être entre 50 et 5000.", file=sys.stderr)
        sys.exit(1)

    # Logique de nom de fichier (peut être à modifier plus tard)
    nom_fichier = args.nom_fichier
    if not nom_fichier:
        secteur_safe = args.secteur.lower().replace(" ", "_").replace("é", "e")
        date_str = datetime.date.today().isoformat()
        nom_fichier = f"donnees_{secteur_safe}_{date_str}"

    print(f"Génération de {args.lignes} lignes pour le secteur '{args.secteur}'...")

    try:
        headers, data = generate_data(args.secteur, args.lignes)
        write_csv_file(headers, data, nom_fichier)
    except ValueError as e:
        print(f"Erreur: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
