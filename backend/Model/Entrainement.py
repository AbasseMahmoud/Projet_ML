# import pandas as pd
# from sklearn.metrics import accuracy_score,precision_score,recall_score, f1_score,confusion_matrix
# from sklearn.tree import DecisionTreeClassifier
# from sklearn.neighbors import KNeighborsClassifier
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.linear_model import LogisticRegression
# from sklearn.svm import SVC
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import MinMaxScaler, StandardScaler
# import matplotlib
# matplotlib.use('Agg')  # Set backend before importing pyplot
# import matplotlib.pyplot as plt
# from sklearn.utils import resample
# from imblearn.over_sampling import SMOTE
# import joblib as jb
# import seaborn as sns
# def train_model():
#     pf = pd.read_csv("Model/creditcarddata.csv")  
#     print(pf.head())
   
#     return pf

# dt = train_model()
# # Fonction pour valeurs manquantes
# # print('abasssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss')
# # print(dt.describe())

# # print('dfghjjjjhhhhhhhhhhhhhhhhhhhhhhh')
# # print(dt.shape)
# def verifier_valeurs_manquantes(pf:pd.DataFrame):
#     print("Valeurs manquantes")
#     absentes = pf.isna().sum()
#     print(absentes[absentes>0])
#     return absentes.to_dict()


# def verifier_valeur_aberantes(pf: pd.DataFrame):
#     """
#     Retourne un dictionnaire détaillé des valeurs aberrantes pour l'API
#     """
#     valeurs_aberante = {}
#     print("Valeurs Aberantes avec IQR")
    
#     # Colonnes à analyser (exclut les binaires et ID)
#     colonnes_a_analyser = [
#         'Age', 
#         'TransactionAmount', 
#         'CardExpiryDate',
#         'HouseTypeID',
#         'ContactAvaliabilityID',
#         'ProductID',
#         'CIF'
#     ]
    
#     for col in colonnes_a_analyser:
#         if col not in pf.columns:
#             continue
            
#         Q1 = pf[col].quantile(0.25)
#         Q3 = pf[col].quantile(0.75)
#         IQR = Q3 - Q1
#         inf = Q1 - 1.5 * IQR
#         sup = Q3 + 1.5 * IQR
        
#         # Compter les outliers
#         count_outliers = pf[(pf[col] < inf) | (pf[col] > sup)].shape[0]
        
#         if count_outliers > 0:
#             valeurs_aberante[col] = {
#                 'count': int(count_outliers),
#                 'borne_inf': float(inf),
#                 'borne_sup': float(sup),
#                 'pourcentage': float((count_outliers / len(pf)) * 100),
#                 'min_original': float(pf[col].min()),
#                 'max_original': float(pf[col].max())
#             }

#     return valeurs_aberante



# def corriger_valeurs_aberantes(pf: pd.DataFrame):
#     """
#     Corrige les valeurs aberrantes et retourne les stats avant/après pour l'API
#     """
#     pf_corrige = pf.copy()
    
#     # Calcul des valeurs aberrantes AVANT correction
#     valeurs_avant = verifier_valeur_aberantes(pf)
    
#     # Colonnes à exclure de la correction
#     colonnes_exclues = ['PotentialFraud']
    
#     # Application de la correction
#     for col in pf_corrige.select_dtypes(include='number').columns:
#         if col in colonnes_exclues:
#             continue  # passer cette colonne sans correction

#         Q1 = pf_corrige[col].quantile(0.25)
#         Q3 = pf_corrige[col].quantile(0.75)
#         IQR = Q3 - Q1
#         inf = Q1 - 1.5 * IQR
#         sup = Q3 + 1.5 * IQR
        
#         pf_corrige[col] = pf_corrige[col].clip(lower=inf, upper=sup)
    
#     # Calcul des valeurs aberrantes APRÈS correction
#     valeurs_apres = verifier_valeur_aberantes(pf_corrige)
    
#     # Préparation des résultats pour l'API
#     resultat_comparaison = {
#         'avant_correction': valeurs_avant,
#         'apres_correction': valeurs_apres,
#         'statistiques_globales': {
#             'total_avant': sum([v['count'] for v in valeurs_avant.values()]),
#             'total_apres': sum([v['count'] for v in valeurs_apres.values()]),
#             'reduction': sum([v['count'] for v in valeurs_avant.values()]) - sum([v['count'] for v in valeurs_apres.values()]),
#             'pourcentage_reduction': ((sum([v['count'] for v in valeurs_avant.values()]) - sum([v['count'] for v in valeurs_apres.values()])) / 
#                                     sum([v['count'] for v in valeurs_avant.values()]) * 100) if sum([v['count'] for v in valeurs_avant.values()]) > 0 else 0
#         }
#     }
    
#     return pf_corrige, resultat_comparaison


# # Fonction pour vérifier les doublons

# def  verifier_doublons (pf:pd.DataFrame):
#     nb_doublons  = pf.duplicated().sum()
#     return {"nombre_de_doublons": int(nb_doublons)}

# # Fonction pour supprimer les doublons

# def supprmer_doublons(pf:pd.DataFrame):
#     initial = pf.shape[0]
#     pf_nettoyer = pf.drop_duplicates()
#     final = pf_nettoyer.shape[0]

#     return {
#         'Avant': initial,
#         'Apres': final,
#         'Supprimes': initial - final
#     }


# # Separation train/test
# def preparer_donnees(test_size=0.3, random_state=42):
    
#     print(" Chargement des données avec train_model()")
#     pf = train_model()

#     X = pf.drop(columns=['PotentialFraud'])
#     Y = pf['PotentialFraud']

#     # Séparation train/test avec stratification # test_size=0.3,
#     X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=test_size, random_state=random_state, stratify=Y)

#     print("\n Distribution après la séparation :")
#     print("Train :")
#     print(Y_train.value_counts())
#     print("\nTest :")
#     print(Y_test.value_counts())
#     print("\nDataset complet :")
#     # print(pf['PotentialFraud'].value_counts())
#     return X_train, X_test, Y_train, Y_test, pf

# # SMOTE CORRECTION DESEQUILIBRE

# def appliquer_smote(X_train, Y_train, random_state=42):
#     """
#     Applique SMOTE sur les variables numériques du jeu d'entraînement.
#     """
#     print("\n  Correction du déséquilibre avec SMOTE...")

#     x_numerique = X_train.select_dtypes(include=['number'])

    
#     smote = SMOTE(
#         sampling_strategy=0.3,  # 30% de fraudes 
#         random_state=random_state
#     )
    
#     x_train_res, y_train_res = smote.fit_resample(x_numerique, Y_train)

#     print("\n Distribution après SMOTE (train) :")
#     print(pd.Series(y_train_res).value_counts())
    
#     #  Ajoutez des informations détaillées
#     fraud_ratio_before = (Y_train.sum() / len(Y_train)) * 100
#     fraud_ratio_after = (y_train_res.sum() / len(y_train_res)) * 100
    
#     print(f"\n Ratio fraude avant : {fraud_ratio_before:.1f}%")
#     print(f" Ratio fraude après : {fraud_ratio_after:.1f}%")
#     print(f" Échantillons fraudes générés : {y_train_res.sum() - Y_train.sum()}")

#     return x_train_res, y_train_res
# # Normalisation des donnees numeriques
# def appliquer_normalisation(x_train_res, X_test):
#     """
#     Applique StandardScaler sur les colonnes numériques NON BINAIRES de X_train_res et X_test.

#     Retourne :
#     - X_train_normaliser : données d'entraînement normalisées
#     - X_test_numeric_normaliser : données de test normalisées  
#     - normaliser : instance du scaler (utile si besoin plus tard)
#     """
#     # Identifier les colonnes binaires (0/1)
#     binary_columns = ['Gender', 'HomeCountry', 'TransactionCountry', 
#                      'LargePurchase', 'TransactionCurrencyCode', 'PotentialFraud']
    
#     # Colonnes à normaliser (numériques non binaires)
#     columns_to_normalize = [col for col in x_train_res.columns 
#                            if col not in binary_columns and x_train_res[col].dtype in ['int64', 'float64']]
    
#     print(f"Colonnes à normaliser : {columns_to_normalize}")
#     print(f"Colonnes binaires conservées telles quelles : {binary_columns}")
    
#     normaliser = StandardScaler()

#     # Normalisation uniquement sur les colonnes sélectionnées
#     x_train_normalized_part = normaliser.fit_transform(x_train_res[columns_to_normalize])
#     x_test_normalized_part = normaliser.transform(X_test[columns_to_normalize])
    
#     # Recréer les DataFrames complets avec les colonnes normalisées + binaires
#     x_train_normaliser = x_train_res.copy()
#     x_test_numeric_normaliser = X_test.copy()
    
#     # Remplacer les colonnes normalisées
#     x_train_normaliser[columns_to_normalize] = x_train_normalized_part
#     x_test_numeric_normaliser[columns_to_normalize] = x_test_normalized_part
    
#     # Sauvegarder le scaler pour la prédiction
#     jb.dump(normaliser, "Model/scaler.pkl")
#     jb.dump(columns_to_normalize, "Model/columns_to_normalize.pkl")  # Sauvegarder aussi la liste des colonnes
    
#     print("Scaler sauvegardé pour la prédiction")
#     print(f"Normalisation appliquée sur {len(columns_to_normalize)} colonnes")
    
#     return x_train_normaliser, x_test_numeric_normaliser, normaliser



# def entrainer_et_evaluer_modeles(
#     x_train_res, y_train_res,
#     x_train_normalise, x_test, x_test_normalise,
#     y_test
# ):
#     """
#     Version améliorée qui retourne aussi les prédictions pour générer les matrices
#     """
#     models = {
#         'LogisticRegression': LogisticRegression(random_state=42),
#         'DecisionTree': DecisionTreeClassifier(random_state=42),
#         'RandomForest': RandomForestClassifier(random_state=42),
#         'KNeighbors': KNeighborsClassifier(),
#         'SVM': SVC(probability=True, random_state=42)
#     }

#     results = {}
#     model_metrics = {}  
#     model_instances = {}
#     predictions = {}  #  stocker les prédictions

#     for name, model in models.items():
#         print(f"\n=== Entraînement : {name} ===")

#         # Choix des données selon le modèle
#         if name in ['DecisionTree', 'RandomForest']:
#             model.fit(x_train_res, y_train_res)
#             x_test_utilise = x_test.select_dtypes(include=['number'])
#         else:
#             model.fit(x_train_normalise, y_train_res)
#             x_test_utilise = x_test_normalise

#         # Prédiction
#         y_pred = model.predict(x_test_utilise)
#         predictions[name] = y_pred  # Sauvegarder les prédictions

#         # Matrice de confusion
#         mc = confusion_matrix(y_test, y_pred)
#         VN, FP = mc[0]
#         FN, VP = mc[1]

#         # Métriques
#         acc = accuracy_score(y_test, y_pred)
#         prec = precision_score(y_test, y_pred, zero_division=0)
#         rec = recall_score(y_test, y_pred, zero_division=0)
#         f1 = f1_score(y_test, y_pred, zero_division=0)

#         # Stockage
#         results[name] = [acc, prec, rec, f1]
#         model_metrics[name] = {
#             'accuracy': acc,
#             'precision': prec,
#             'recall': rec,
#             'f1_score': f1,
#             'VP': VP,
#             'FP': FP,
#             'FN': FN,
#             'VN': VN,
#             'confusion_matrix': mc.tolist() 
#         }

#         model_instances[name] = model

#     # Résumé final
#     df_results = pd.DataFrame(results, index=["Accuracy", "Precision", "Recall", "F1-score"]).T
    
#     return df_results, model_metrics, model_instances, predictions 

# def afficher_matrices_confusion(models, X_test, x_test_normalise, Y_test):
#     """
#     Affiche les matrices de confusion de plusieurs modèles.

#     Paramètres :
#     - models : dictionnaire {nom_modele: modele_entraine}
#     - X_test : DataFrame brut de test (avec colonnes numériques)
#     - X_test_normalise : données normalisées pour les modèles qui en ont besoin
#     - Y_test : vraies classes (labels)
#     """

#     for name, model in models.items():
#         print(f"\n=== Matrice de confusion pour {name} ===")

#         # Choix des features à utiliser selon le modèle
#         if name in ['DecisionTree', 'RandomForest']:
#             x_test_utiliser = X_test.select_dtypes(include=['number'])
#         else:
#             x_test_utiliser = x_test_normalise

#         # Prédiction
#         y_pred = model.predict(x_test_utiliser)

#         # Matrice de confusion
#         mc = confusion_matrix(Y_test, y_pred)
#         print("Matrice de confusion (valeurs brutes) :")
#         print(mc)

#         # Affichage graphique
#         plt.figure(figsize=(5, 4))
#         sns.heatmap(mc, annot=True, fmt='d', cmap='Blues')
#         plt.title(f"Matrice de confusion - {name}")
#         plt.xlabel("Prédit")
#         plt.ylabel("Réel")
#         plt.tight_layout()
#         # plt.show()


# def analyser_model_metrics(model_metrics):
#     """
#     Analyse les métriques des modèles avec des commentaires personnalisés
#     basés sur les vraies performances.
#     """
#     rows = []

#     for name, metrics in model_metrics.items():
#         VN = metrics['VN']
#         FP = metrics['FP']
#         FN = metrics['FN']
#         VP = metrics['VP']
        
#         accuracy = metrics['accuracy']
#         precision = metrics['precision']
#         recall = metrics['recall']
#         f1 = metrics['f1_score']

#         # Commentaires personnalisés basés sur les performances réelles
#         commentaire = ""
        
#         # Analyse basée sur le F1-score
#         if f1 == 0:
#             commentaire = " Modèle inefficace - Aucune fraude détectée"
#         elif f1 < 0.3:
#             commentaire = " Performances très faibles - Presque aucune détection"
#         elif f1 < 0.5:
#             commentaire = " Performances médiocres - Détection limitée"
#         elif f1 < 0.6:
#             commentaire = " Performances acceptables - Détection modérée"
#         elif f1 < 0.7:
#             commentaire = " Bonnes performances - Bon équilibre"
#         else:
#             commentaire = " Excellentes performances - Détection optimale"

#         # Détails spécifiques par modèle
#         if recall < 0.3:
#             commentaire += ". Recall critique - Trop de fraudes manquées."
#         elif recall < 0.5:
#             commentaire += ". Recall faible - Amélioration nécessaire."
#         elif recall < 0.7:
#             commentaire += ". Recall acceptable."
#         else:
#             commentaire += ". Bon recall - Bonne détection des fraudes."

#         if precision < 0.3:
#             commentaire += " Précision faible - Trop de fausses alertes."
#         elif precision < 0.5:
#             commentaire += " Précision modérée - Quelques fausses alertes."
#         elif precision < 0.7:
#             commentaire += " Bonne précision - Peu de fausses alertes."
#         else:
#             commentaire += " Excellente précision - Alertes fiables."

#         # Informations spécifiques
#         if VP == 0:
#             commentaire += " Aucune fraude correctement identifiée."
#         elif FN > VP * 2:
#             commentaire += f" {FN} fraudes manquées sur {FN + VP}."

#         rows.append({
#             'Model': name,
#             'Accuracy': accuracy,
#             'Precision': precision,
#             'Recall': recall,
#             'F1-score': f1,
#             'Commentaire': commentaire.strip()
#         })

#     comparison_df = pd.DataFrame(rows)
#     comparison_df = comparison_df.sort_values(by='F1-score', ascending=False).reset_index(drop=True)
    
#     print("\n=== ANALYSE DÉTAILLÉE DES MODÈLES ===")
#     print(comparison_df)
    
#     return comparison_df

# def sauvegarder_metriques(model_metrics, dossier="Model"):
#     """
#     Sauvegarde les métriques des modèles dans un fichier pickle
#     """
#     chemin_fichier = f"{dossier}/model_metrics.pkl"
#     jb.dump(model_metrics, chemin_fichier)
#     print(f" Métriques sauvegardées dans '{chemin_fichier}'")
    
#     # Sauvegarde également en CSV pour backup
#     df_metrics = pd.DataFrame([
#         {
#             'Model': name,
#             'Accuracy': metrics['accuracy'],
#             'Precision': metrics['precision'], 
#             'Recall': metrics['recall'],
#             'F1-score': metrics['f1_score'],
#             'VP': metrics['VP'],
#             'FP': metrics['FP'],
#             'FN': metrics['FN'],
#             'VN': metrics['VN']
#         }
#         for name, metrics in model_metrics.items()
#     ])
#     df_metrics.to_csv(f"{dossier}/model_metrics.csv", index=False)
#     print(" Métriques sauvegardées en CSV également")

# def sauvegarder_splits(X_train, X_test, Y_train, Y_test, dossier="Model"):
#     """Sauvegarde les splits pour reproductibilité"""
#     jb.dump(X_train, f"{dossier}/X_train.pkl")
#     jb.dump(X_test, f"{dossier}/X_test.pkl")
#     jb.dump(Y_train, f"{dossier}/Y_train.pkl")
#     jb.dump(Y_test, f"{dossier}/Y_test.pkl")
#     print(" Splits sauvegardés pour reproductibilité")

# def charger_splits(dossier="Model"):
#     """Charge les splits sauvegardés"""
#     try:
#         X_train = jb.load(f"{dossier}/X_train.pkl")
#         X_test = jb.load(f"{dossier}/X_test.pkl")
#         Y_train = jb.load(f"{dossier}/Y_train.pkl")
#         Y_test = jb.load(f"{dossier}/Y_test.pkl")
#         print(" Splits chargés depuis sauvegarde")
#         return X_train, X_test, Y_train, Y_test
#     except:
#         print(" Splits non trouvés, génération nouvelle...")
#         return None
       

# # # 1. Chargement et vérification données
# pf = train_model()  # Charge les données
# verifier_valeurs_manquantes(pf)  # Affiche valeurs manquantes
# verifier_valeur_aberantes(pf)    # Affiche valeurs aberrantes
# pf_corrige, _ = corriger_valeurs_aberantes(pf) # Corrige outliers
# print(verifier_doublons(pf_corrige))          # Vérifie doublons
# pf_nettoye = supprmer_doublons(pf_corrige)    # Supprime doublons

# # 2. Préparation données : séparation train/test
# X_train, X_test, Y_train, Y_test, pf = preparer_donnees(random_state=42)

# # 3. Correction du déséquilibre avec SMOTE (sur données train)
# X_train_res, Y_train_res = appliquer_smote(X_train, Y_train,random_state=42)

# print("Normalisation appliquée")
# # 4. Normalisation des données numériques
# X_train_norm, X_test_norm, scaler = appliquer_normalisation(X_train_res, X_test)

# # 5. Entraînement et évaluation des modèles
# df_results, model_metrics, models_entraine, predictions = entrainer_et_evaluer_modeles(
#     X_train_res, Y_train_res,
#     X_train_norm,
#     X_test,
#     X_test_norm,
#     Y_test
# )

# sauvegarder_metriques(model_metrics)
# df_comparaison = analyser_model_metrics(model_metrics)
# print(df_comparaison)



# # # Sinon on  peut entraîner manuellement :
# models = {
#     'LogisticRegression': LogisticRegression(),
#     'DecisionTree': DecisionTreeClassifier(),
#     'RandomForest': RandomForestClassifier(),
#     'KNeighbors': KNeighborsClassifier(),
#     'SVM': SVC()
# }

# for name, model in models.items():
#     if name in ['DecisionTree', 'RandomForest']:
#         model.fit(X_train_res, Y_train_res)
#     else:
#         model.fit(X_train_norm, Y_train_res)

# # # Maintenant on peut afficher les matrices
# afficher_matrices_confusion(models, X_test, X_test_norm, Y_test)

# # Rappel :

# # Vrai Positif (VP) : fraude correctement détectée

# # Faux Positif (FP) : transaction normale prédite comme fraude

# # Faux Négatif (FN) : fraude non détectée

# # Vrai Négatif (VN) : transaction normale correctement classée

# # On note les matrices : [ [VN, FP], [FN, VP] ].

# # ANALYSE Logistic Regression
# # VN = 357, FP = 247 → beaucoup de fausses alertes

# # FN = 31, VP = 45 → 45 fraudes détectées, 31 manquées

# # Precision faible (45 / (45+247) ≈ 0.15)

# # Recall moyen (45 / (45+31) ≈ 0.59)

# # Conclusion : le modèle prédit trop de fraudes fausses, mais détecte une bonne partie des vraies fraudes.

# #  ANALYSE Random Forest

# # VN = 554, FP = 50 → beaucoup moins de fausses alertes que LR

# # FN = 31, VP = 45 → le nombre de fraudes détectées reste le même que LR

# # Precision meilleure (45 / (45+50) ≈ 0.47)

# # Recall similaire (45 / (45+31) ≈ 0.59)

# # Conclusion : beaucoup plus fiable que LR pour éviter les fausses alertes, mais le recall n’augmente pas.

# # ANALYSE  Decision Tree 

# # VN = 556, FP = 48 → très peu de fausses alertes

# # FN = 28, VP = 48 → détecte un peu plus de fraudes que DT

# # Precision =( 48 / (48+48) = 0.5)

# # Recall = 48 / (48+28) ≈ 0.63

# # Conclusion : meilleur compromis entre précision et rappel, moins de fausses alertes, plus de fraudes détectées.

# # ANALYSE DE KNeighbors

# # VN = 513, FP = 91 → plus de fausses alertes que RF ou DT

# # FN = 26, VP = 50 → un peu plus de fraudes détectées

# # Precision = 50 / (50+91) ≈ 0.35

# # Recall = 50 / (50+26) ≈ 0.66

# # Conclusion : meilleur recall que RF, mais beaucoup de fausses alertes → moins pratique dans la réalité.

# # ANALYSE DE SVM
# # VN = 388, FP = 216 → beaucoup de fausses alertes

# # FN = 26, VP = 50 → rappel similaire à KNN

# # Precision = 50 / (50+216) ≈ 0.19

# # Recall = 50 / (50+26) ≈ 0.66

# # Conclusion : rappelle les fraudes mais produit trop de fausses alertes → peu utilisable.


# # Trouver le nom du meilleur modèle selon le F1-score
# def sauvegarder_meilleur_modele(df_results, models_entraine, dossier="Model"):
#     """
#     Sauvegarde le modèle avec le meilleur F1-score dans le dossier spécifié.
    
#     Args:
#         df_results (pd.DataFrame): DataFrame des métriques des modèles
#         models_entraine (dict): dictionnaire des modèles entraînés
#         dossier (str): chemin du dossier où sauvegarder (par défaut "Model")
#     """
#     best_model_name = df_results['F1-score'].idxmax()
#     best_model = models_entraine[best_model_name]
#     chemin_fichier = f"{dossier}/{best_model_name}_best_model.pkl"
    
#     jb.dump(best_model, chemin_fichier)
#     print(f"Modèle '{best_model_name}' sauvegardé dans '{chemin_fichier}'.")

# sauvegarder_meilleur_modele(df_results, models_entraine)
# # 4. Normalisation des données numériques
# x_train_norm, X_test_norm, scaler = appliquer_normalisation(X_train_res, X_test)


# def get_normalisation_stats():
#     """
#     Retourne les statistiques de normalisation pour l'API
#     """
#     print(" Début du calcul des statistiques de normalisation...")
    
#     try:
#         # Exécution du pipeline
#         pf = train_model()
        
#         # Prétraitement
#         pf_corrige, _ = corriger_valeurs_aberantes(pf)
#         pf_nettoye = supprmer_doublons(pf_corrige)
        
#         # Préparation des données
#         X_train, X_test, Y_train, Y_test, _ = preparer_donnees()
        
#         # SMOTE
#         X_train_res, Y_train_res = appliquer_smote(X_train, Y_train)
        
#         # Normalisation
#         X_train_norm, X_test_norm, scaler = appliquer_normalisation(X_train_res, X_test)
        
#         # CORRECTION : Calcul des statistiques AVANT normalisation
#         # Utiliser .mean().mean() pour la moyenne globale des DataFrames
#         stats_avant = {
#             'moyenne_globale': float(X_train_res.mean().mean()),
#             'ecart_type_globale': float(X_train_res.std().mean()),
#             'min_global': float(X_train_res.min().min()),
#             'max_global': float(X_train_res.max().max()),
#             'shape': list(X_train_res.shape),
#             'colonnes': X_train_res.columns.tolist()
#         }
        
#         # CORRECTION : Calcul des statistiques APRÈS normalisation
#         # X_train_norm est un DataFrame, on  utilise .mean().mean()
#         stats_apres = {
#             'moyenne_globale': float(X_train_norm.mean().mean()),
#             'ecart_type_globale': float(X_train_norm.std().mean()),
#             'min_global': float(X_train_norm.min().min()),
#             'max_global': float(X_train_norm.max().max()),
#             'shape': list(X_train_norm.shape)
#         }
        
#         # CORRECTION : Calcul des vérifications avec les bonnes valeurs
#         moyenne_abs = abs(X_train_norm.mean().mean())  # Double mean() pour DataFrame
#         ecart_type_abs = abs(X_train_norm.std().mean() - 1.0)  # Double mean() pour DataFrame
        
#         verification = {
#             'moyenne_proche_zero': 'oui' if moyenne_abs < 0.01 else 'non',
#             'ecart_type_proche_un': 'oui' if ecart_type_abs < 0.1 else 'non',
#             'score_qualite': ' Excellente' if moyenne_abs < 0.01 and ecart_type_abs < 0.1 
#                             else 'Correcte' if moyenne_abs < 0.1 and ecart_type_abs < 0.5 
#                             else ' À vérifier',
#             'moyenne_calculee': float(X_train_norm.mean().mean()),
#             'ecart_type_calcule': float(X_train_norm.std().mean()),
#             'seuil_moyenne': 0.01,
#             'seuil_ecart_type': 0.1
#         }
        
#         # CORRECTION : Statistiques par colonne avec gestion sécurisée
#         details_colonnes = {}
#         colonnes_numeriques = X_train_res.select_dtypes(include=['number']).columns
        
#         for i, col in enumerate(colonnes_numeriques[:5]):  # Limité aux 5 premières
#             if col in X_train_res.columns and col in X_train_norm.columns:
#                 avant_col = X_train_res[col]
                
#                 # Pour la colonne après normalisation, s'assurer qu'on accède correctement
#                 apres_col = X_train_norm[col]
                
#                 details_colonnes[col] = {
#                     'avant': {
#                         'moyenne': float(avant_col.mean()),
#                         'ecart_type': float(avant_col.std()),
#                         'min': float(avant_col.min()),
#                         'max': float(avant_col.max())
#                     },
#                     'apres': {
#                         'moyenne': float(apres_col.mean()),
#                         'ecart_type': float(apres_col.std()),
#                         'min': float(apres_col.min()),
#                         'max': float(apres_col.max())
#                     }
#                 }
        
#         resultat = {
#             'avant_normalisation': stats_avant,
#             'apres_normalisation': stats_apres,
#             'verification': verification,
#             'details_colonnes': details_colonnes,
#             'details_techniques': {
#                 'type_normaliseur': 'StandardScaler',
#                 'algorithme': 'Standardisation (moyenne=0, écart-type=1)',
#                 'colonnes_normalisees': len(X_train_res.columns),
#                 'taille_entrainement': X_train_norm.shape[0],
#                 'taille_test': X_test_norm.shape[0],
#                 'nombre_features': X_train_norm.shape[1]
#             }
#         }
        
#         print("Statistiques de normalisation calculées avec succès")
#         return resultat
        
#     except Exception as e:
#         print(f" Erreur dans get_normalisation_stats: {str(e)}")
#         import traceback
#         print(f" Stack trace: {traceback.format_exc()}")
        
#         # Retourner des données par défaut en cas d'erreur
#         return {
#             'avant_normalisation': {
#                 'moyenne_globale': 0.0,
#                 'ecart_type_globale': 0.0,
#                 'min_global': 0.0,
#                 'max_global': 0.0,
#                 'shape': [0, 0],
#                 'colonnes': []
#             },
#             'apres_normalisation': {
#                 'moyenne_globale': 0.0,
#                 'ecart_type_globale': 0.0,
#                 'min_global': 0.0,
#                 'max_global': 0.0,
#                 'shape': [0, 0]
#             },
#             'verification': {
#                 'moyenne_proche_zero': 'non',
#                 'ecart_type_proche_un': 'non',
#                 'score_qualite': '❌ Erreur de calcul',
#                 'moyenne_calculee': 0.0,
#                 'ecart_type_calcule': 0.0,
#                 'seuil_moyenne': 0.01,
#                 'seuil_ecart_type': 0.1
#             },
#             'details_colonnes': {},
#             'details_techniques': {
#                 'type_normaliseur': 'StandardScaler',
#                 'algorithme': 'Standardisation (moyenne=0, écart-type=1)',
#                 'colonnes_normalisees': 0,
#                 'taille_entrainement': 0,
#                 'taille_test': 0,
#                 'nombre_features': 0
#             }
#         }




import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from imblearn.over_sampling import SMOTE
import joblib as jb
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

# -----------------------------
# 1. Chargement des données
# -----------------------------
def load_data(path="Model/creditcarddata.csv"):
    df = pd.read_csv(path)
    print("Données chargées :", df.shape)
    return df

# -----------------------------
# 2. Vérification valeurs manquantes
# -----------------------------
def check_missing(df):
    missing = df.isna().sum()
    print("Valeurs manquantes :", missing[missing>0])
    return missing.to_dict()

# -----------------------------
# 3. Gestion valeurs aberrantes
# -----------------------------
def detect_outliers(df, cols):
    outliers = {}
    for col in cols:
        if col not in df.columns:
            continue
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        inf = Q1 - 1.5*IQR
        sup = Q3 + 1.5*IQR
        count = df[(df[col] < inf) | (df[col] > sup)].shape[0]
        if count>0:
            outliers[col] = {'count': count, 'min': float(df[col].min()), 'max': float(df[col].max()), 'lower_bound': float(inf), 'upper_bound': float(sup)}
    return outliers

def correct_outliers(df, cols_to_exclude=['PotentialFraud']):
    df_corr = df.copy()
    numeric_cols = df_corr.select_dtypes(include=['number']).columns
    for col in numeric_cols:
        if col in cols_to_exclude:
            continue
        Q1 = df_corr[col].quantile(0.25)
        Q3 = df_corr[col].quantile(0.75)
        IQR = Q3 - Q1
        df_corr[col] = df_corr[col].clip(lower=Q1-1.5*IQR, upper=Q3+1.5*IQR)
    return df_corr

# -----------------------------
# 4. Suppression des doublons
# -----------------------------
def remove_duplicates(df):
    initial = df.shape[0]
    df_clean = df.drop_duplicates()
    print(f"Doublons supprimés : {initial - df_clean.shape[0]}")
    return df_clean

# -----------------------------
# 5. Encodage variables qualitatives
# -----------------------------
def encode_categorical(df, categorical_cols):
    df_encoded = df.copy()
    encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
        encoders[col] = le
    return df_encoded, encoders

# -----------------------------
# 6. Préparation train/test
# -----------------------------
def prepare_data(df, target='PotentialFraud', test_size=0.3, random_state=42):
    X = df.drop(columns=[target])
    y = df[target]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size,
                                                        random_state=random_state, stratify=y)
    print("Distribution train/test :")
    print("Train :", y_train.value_counts())
    print("Test :", y_test.value_counts())
    return X_train, X_test, y_train, y_test

# -----------------------------
# 7. Correction déséquilibre avec SMOTE
# -----------------------------
def apply_smote(X_train, y_train, random_state=42, sampling_strategy=0.3):
    smote = SMOTE(sampling_strategy=sampling_strategy, random_state=random_state)
    X_res, y_res = smote.fit_resample(X_train, y_train)
    print("Distribution après SMOTE :", pd.Series(y_res).value_counts())
    return X_res, y_res

# -----------------------------
# 8. Normalisation des colonnes numériques
# -----------------------------
def normalize_numeric(X_train, X_test, exclude_cols=[]):
    numeric_cols = [col for col in X_train.select_dtypes(include=['number']).columns if col not in exclude_cols]
    scaler = StandardScaler()
    X_train_norm = X_train.copy()
    X_test_norm = X_test.copy()
    X_train_norm[numeric_cols] = scaler.fit_transform(X_train[numeric_cols])
    X_test_norm[numeric_cols] = scaler.transform(X_test[numeric_cols])
    return X_train_norm, X_test_norm, scaler, numeric_cols

# -----------------------------
# 9. Entraînement et évaluation des modèles
# -----------------------------
def train_and_evaluate(X_train, y_train, X_test, y_test):
    models = {
        'LogisticRegression': LogisticRegression(random_state=42),
        'DecisionTree': DecisionTreeClassifier(random_state=42),
        'RandomForest': RandomForestClassifier(random_state=42),
        'KNeighbors': KNeighborsClassifier(),
        'SVM': SVC(probability=True, random_state=42)
    }

    metrics_summary = {}
    trained_models = {}

    for name, model in models.items():
        # Choisir features selon modèle
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:,1] if hasattr(model, "predict_proba") else None

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        cm = confusion_matrix(y_test, y_pred)

        metrics_summary[name] = {
            'accuracy': acc,
            'precision': prec,
            'recall': rec,
            'f1_score': f1,
            'confusion_matrix': cm.tolist()
        }

        trained_models[name] = model

        print(f"\n{name} : Accuracy={acc:.3f}, Precision={prec:.3f}, Recall={rec:.3f}, F1={f1:.3f}")
        print("Confusion matrix:\n", cm)

    return trained_models, metrics_summary

# -----------------------------
# 10. Sauvegarde du meilleur modèle
# -----------------------------
def save_best_model(models, metrics_summary, folder="Model"):
    best_model_name = max(metrics_summary, key=lambda x: metrics_summary[x]['f1_score'])
    best_model = models[best_model_name]
    jb.dump(best_model, f"{folder}/{best_model_name}_best_model.pkl")
    print(f"Meilleur modèle ({best_model_name}) sauvegardé.")

# -----------------------------
# 11. Pipeline complet
# -----------------------------
if __name__ == "__main__":
    df = load_data()
    check_missing(df)

    # Colonnes numériques à vérifier pour outliers
    numeric_cols = ['Age','TransactionAmount','CardExpiryDate','HouseTypeID','ContactAvaliabilityID','ProductID','CIF']
    detect_outliers(df, numeric_cols)
    df = correct_outliers(df)
    df = remove_duplicates(df)

    # Colonnes catégorielles
    categorical_cols = ['Gender','HomeCountry','TransactionCountry','ProductID','HouseTypeID','ContactAvaliabilityID','CIF']
    df_encoded, encoders = encode_categorical(df, categorical_cols)

    # Train/Test
    X_train, X_test, y_train, y_test = prepare_data(df_encoded)

    # SMOTE
    X_res, y_res = apply_smote(X_train, y_train)

    # Normalisation
    X_train_norm, X_test_norm, scaler, numeric_cols_used = normalize_numeric(X_res, X_test, exclude_cols=categorical_cols+['PotentialFraud'])

    # Entraînement
    trained_models, metrics_summary = train_and_evaluate(X_train_norm, y_res, X_test_norm, y_test)

    # Sauvegarde meilleur modèle et scaler
    save_best_model(trained_models, metrics_summary)
    jb.dump(scaler, "Model/scaler.pkl")
    jb.dump(numeric_cols_used, "Model/columns_to_normalize.pkl")
    print("Pipeline terminé.")
