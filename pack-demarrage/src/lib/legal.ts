/**
 * Mention légale RGPD affichée à l'inscription d'un client (case à cocher
 * obligatoire). Le texte est versionné : un instantané (consentTextSnapshot)
 * est enregistré sur chaque client pour garder une preuve du consentement
 * donné, même si ce texte est modifié plus tard.
 */
export const CONSENT_TEXT_VERSION = "2026-08-25";

export const CONSENT_TEXT =
  "J'accepte que Farmer CrossFit collecte et conserve mes données " +
  "(nom, prénom, téléphone, email) afin de créer mon accès à la plateforme " +
  "Pack Démarrage pendant 3 mois, et de transmettre mes coordonnées à " +
  "l'intervenant (ostéopathe, diététicienne ou massage sport) que je " +
  "sélectionnerai. Ces données sont conservées le temps de la relation " +
  "commerciale et je peux demander leur suppression à tout moment en " +
  "écrivant à contact@farmer-crossfit.com.";
