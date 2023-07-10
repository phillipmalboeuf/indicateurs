import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeAlertFields {
    text: EntryFieldTypes.Symbol;
    lien?: EntryFieldTypes.Symbol;
    couleur?: EntryFieldTypes.Symbol;
}

export type TypeAlertSkeleton = EntrySkeletonType<TypeAlertFields, "alert">;
export type TypeAlert<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeAlertSkeleton, Modifiers, Locales>;

export interface TypeCategorieFields {
    titre: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    couleur: EntryFieldTypes.Symbol;
    photo?: EntryFieldTypes.AssetLink;
    description?: EntryFieldTypes.RichText;
    sousCategories?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCategorieSkeleton>>;
}

export type TypeCategorieSkeleton = EntrySkeletonType<TypeCategorieFields, "categorie">;
export type TypeCategorie<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeCategorieSkeleton, Modifiers, Locales>;

export interface TypeContenuIndicateurFields {
    titre?: EntryFieldTypes.Symbol;
    id?: EntryFieldTypes.Symbol;
    corps?: EntryFieldTypes.RichText;
    indicateurs?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeIndicateurSkeleton>>;
    aprs?: EntryFieldTypes.RichText;
}

export type TypeContenuIndicateurSkeleton = EntrySkeletonType<TypeContenuIndicateurFields, "contenuIndicateur">;
export type TypeContenuIndicateur<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeContenuIndicateurSkeleton, Modifiers, Locales>;

export interface TypeDashFields {
    titre?: EntryFieldTypes.Symbol;
    text?: EntryFieldTypes.Text;
    lien?: EntryFieldTypes.Symbol;
    externe?: EntryFieldTypes.Boolean;
    bleu?: EntryFieldTypes.Boolean;
    emphasis?: EntryFieldTypes.Boolean;
    image?: EntryFieldTypes.AssetLink;
    colStart?: EntryFieldTypes.Integer;
    colEnd?: EntryFieldTypes.Integer;
    rowStart?: EntryFieldTypes.Integer;
    rowEnd?: EntryFieldTypes.Integer;
}

export type TypeDashSkeleton = EntrySkeletonType<TypeDashFields, "dash">;
export type TypeDash<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeDashSkeleton, Modifiers, Locales>;

export interface TypeImagesFields {
    titre?: EntryFieldTypes.Symbol;
    id?: EntryFieldTypes.Symbol;
    corps?: EntryFieldTypes.RichText;
    images?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    aprs?: EntryFieldTypes.RichText;
}

export type TypeImagesSkeleton = EntrySkeletonType<TypeImagesFields, "images">;
export type TypeImages<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeImagesSkeleton, Modifiers, Locales>;

export interface TypeIndicateurFields {
    titre: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    categorie?: EntryFieldTypes.EntryLink<TypeCategorieSkeleton>;
    lead?: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.RichText;
    sources?: EntryFieldTypes.RichText;
    titreDeLaxe?: EntryFieldTypes.Symbol;
    data?: EntryFieldTypes.Text;
    type?: EntryFieldTypes.Symbol<"Courbe" | "Histogramme">;
    minimum?: EntryFieldTypes.Number;
    maximum?: EntryFieldTypes.Number;
    altTitreDeLaxe?: EntryFieldTypes.Symbol;
    altData?: EntryFieldTypes.Text;
    altType?: EntryFieldTypes.Symbol<"Courbe" | "Histogramme">;
    altMinimum?: EntryFieldTypes.Number;
    altMaximum?: EntryFieldTypes.Number;
}

export type TypeIndicateurSkeleton = EntrySkeletonType<TypeIndicateurFields, "indicateur">;
export type TypeIndicateur<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeIndicateurSkeleton, Modifiers, Locales>;

export interface TypeLienDeNavigationFields {
    titre?: EntryFieldTypes.Symbol;
    lien?: EntryFieldTypes.Symbol;
    externe?: EntryFieldTypes.Boolean;
    sousLiens?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLienDeNavigationSkeleton>>;
}

export type TypeLienDeNavigationSkeleton = EntrySkeletonType<TypeLienDeNavigationFields, "lienDeNavigation">;
export type TypeLienDeNavigation<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeLienDeNavigationSkeleton, Modifiers, Locales>;

export interface TypeLigneDuTableauFields {
    id?: EntryFieldTypes.Symbol;
    gauche?: EntryFieldTypes.RichText;
    droite?: EntryFieldTypes.RichText;
    lien?: EntryFieldTypes.EntryLink<TypeLienDeNavigationSkeleton>;
}

export type TypeLigneDuTableauSkeleton = EntrySkeletonType<TypeLigneDuTableauFields, "ligneDuTableau">;
export type TypeLigneDuTableau<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeLigneDuTableauSkeleton, Modifiers, Locales>;

export interface TypeListeFields {
    titre?: EntryFieldTypes.Symbol;
    id?: EntryFieldTypes.Symbol;
    corps?: EntryFieldTypes.RichText;
    items?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeTextSkeleton>>;
}

export type TypeListeSkeleton = EntrySkeletonType<TypeListeFields, "liste">;
export type TypeListe<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeListeSkeleton, Modifiers, Locales>;

export interface TypeLogosFields {
    titre?: EntryFieldTypes.Symbol;
    id?: EntryFieldTypes.Symbol;
    corps?: EntryFieldTypes.RichText;
    logos?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
}

export type TypeLogosSkeleton = EntrySkeletonType<TypeLogosFields, "logos">;
export type TypeLogos<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeLogosSkeleton, Modifiers, Locales>;

export interface TypeNavigationFields {
    nom?: EntryFieldTypes.Symbol;
    liens?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLienDeNavigationSkeleton>>;
}

export type TypeNavigationSkeleton = EntrySkeletonType<TypeNavigationFields, "navigation">;
export type TypeNavigation<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeNavigationSkeleton, Modifiers, Locales>;

export interface TypePageFields {
    titre: EntryFieldTypes.Symbol;
    id: EntryFieldTypes.Symbol;
    photo?: EntryFieldTypes.AssetLink;
    description?: EntryFieldTypes.RichText;
    bouton?: EntryFieldTypes.EntryLink<TypeLienDeNavigationSkeleton>;
    indicateurVedette?: EntryFieldTypes.EntryLink<TypeIndicateurSkeleton>;
    dashboard?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeDashSkeleton>>;
    contenu?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeContenuIndicateurSkeleton | TypeImagesSkeleton | TypeListeSkeleton | TypeLogosSkeleton | TypeTableauSkeleton | TypeTendancesSkeleton | TypeTextSkeleton>>;
}

export type TypePageSkeleton = EntrySkeletonType<TypePageFields, "page">;
export type TypePage<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypePageSkeleton, Modifiers, Locales>;

export interface TypeSystemFields {
    alert?: EntryFieldTypes.EntryLink<TypeAlertSkeleton>;
    piliers?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCategorieSkeleton>>;
    indicateurs?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeIndicateurSkeleton>>;
}

export type TypeSystemSkeleton = EntrySkeletonType<TypeSystemFields, "system">;
export type TypeSystem<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeSystemSkeleton, Modifiers, Locales>;

export interface TypeTableauFields {
    titre?: EntryFieldTypes.Symbol;
    id?: EntryFieldTypes.Symbol;
    corps?: EntryFieldTypes.RichText;
    titreGauche?: EntryFieldTypes.Symbol;
    titreDroite?: EntryFieldTypes.Symbol;
    lignes?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLigneDuTableauSkeleton>>;
}

export type TypeTableauSkeleton = EntrySkeletonType<TypeTableauFields, "tableau">;
export type TypeTableau<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeTableauSkeleton, Modifiers, Locales>;

export interface TypeTendancesFields {
    titre?: EntryFieldTypes.Symbol;
    id?: EntryFieldTypes.Symbol;
    corps?: EntryFieldTypes.RichText;
    data?: EntryFieldTypes.Text;
    flecheSeulement?: EntryFieldTypes.Boolean;
}

export type TypeTendancesSkeleton = EntrySkeletonType<TypeTendancesFields, "tendances">;
export type TypeTendances<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeTendancesSkeleton, Modifiers, Locales>;

export interface TypeTextFields {
    titre?: EntryFieldTypes.Symbol;
    id?: EntryFieldTypes.Symbol;
    corps?: EntryFieldTypes.RichText;
}

export type TypeTextSkeleton = EntrySkeletonType<TypeTextFields, "text">;
export type TypeText<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeTextSkeleton, Modifiers, Locales>;
