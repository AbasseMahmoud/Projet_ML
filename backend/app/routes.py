from flask import Blueprint, jsonify
import pandas as pd 
from flask import Blueprint, request, jsonify
from .models import User
from . import db
from ..Model.Entrainement import (
    train_model,
    verifier_valeurs_manquantes,
    verifier_valeur_aberantes, 
    # supprimer_valeurs_aberantes,
    verifier_doublons,
    supprmer_doublons,
    preparer_donnees,
    appliquer_smote,
    appliquer_normalisation,
    entrainer_et_evaluer_modeles,
    analyser_model_metrics,
    corriger_valeurs_aberantes
)
bp = Blueprint('main', __name__, url_prefix='/api')



@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Champs manquants'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Nom d’utilisateur déjà utilisé'}), 400

    user = User(username=data['username'])
    user.set_password(data['password'])  # Utilise la méthode set_password pour hasher
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Utilisateur enregistré avec succès !'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Champs manquants'}), 400

    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        return jsonify({'message': 'Connexion réussie'}), 200

    return jsonify({'message': 'Identifiants invalides'}), 401
# 👇 Ajoutez cette route OPTIONS spécifique pour /predict
@bp.route('/predict', methods=['OPTIONS'])
def options_predict():
    return jsonify({'status': 'ok'}), 200


@bp.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bonjour depuis Flask "})
@bp.route('/valeurs-manquantes', methods=['GET'])
def get_valeurs_manquantes():
    pf = train_model()
    resultat = verifier_valeurs_manquantes(pf)
    return jsonify(resultat)

@bp.route('/valeurs-aberrantes', methods=['GET'])
def valeurs_aberrantes():
    pf = train_model()
    resultat = verifier_valeur_aberantes(pf)
    return jsonify(resultat)



@bp.route('/analyse-metrics', methods=['GET'])
def get_analyse_metrics():
    try:
        import joblib
        import os

        filepath = 'Model/model_metrics.pkl'
        
        # chargement  des  métriques
        if os.path.exists(filepath):
            print(" Chargement des VRAIES métriques depuis model_metrics.pkl")
            model_metrics = joblib.load(filepath)
            
            # Utilisation de  la fonction analyser_model_metrics pour formater les données
            comparaison_df = analyser_model_metrics(model_metrics)
            
            return jsonify({
                'success': True,
                'data': comparaison_df.to_dict(orient='records')
            })
        else:
           
            print(" Fichier metrics non trouvé, exécution de l'entraînement...")
            
            # Exécuter le pipeline d'entraînement
            pf = train_model()
            pf_corrige, _ = corriger_valeurs_aberantes(pf)
            pf_nettoye = supprmer_doublons(pf_corrige)
            X_train, X_test, Y_train, Y_test, _ = preparer_donnees()
            X_train_res, Y_train_res = appliquer_smote(X_train, Y_train)
            X_train_norm, X_test_norm, scaler = appliquer_normalisation(X_train_res, X_test)
            
            # Entraînement des modèles
            df_results, model_metrics, models_entraine,predictions = entrainer_et_evaluer_modeles(
                X_train_res, Y_train_res,
                X_train_norm, X_test, X_test_norm, Y_test
            )
            
            # Sauvegarder les métriques
            sauvegarder_metriques(model_metrics)
            
            # Formater les résultats
            comparaison_df = analyser_model_metrics(model_metrics)
            
            return jsonify({
                'success': True,
                'data': comparaison_df.to_dict(orient='records'),
                'message': 'Métriques générées et sauvegardées avec succès'
            })

    except Exception as e:
        import traceback
        print(" Erreur dans /analyse-metrics :", str(e))
        print(traceback.format_exc())
        
        
        return jsonify({
            'success': False, 
            'data': get_mock_metrics_real(),
            'error': str(e),
            'message': 'Utilisation des données de secours'
        })

def get_mock_metrics_real():
    """Retourne les VRAIES valeurs de vos modèles (données de secours)"""
    return [
        {
            "Model": "RandomForest",
            "Accuracy": 0.904412,
            "Precision": 0.566,
            "Recall": 0.618,
            "F1-score": 0.580645,
            "Commentaire": "Meilleur modèle - Détection acceptable mais recall à améliorer"
        },
        {
            "Model": "DecisionTree", 
            "Accuracy": 0.885294,
            "Precision": 0.495,
            "Recall": 0.592,
            "F1-score": 0.524390,
            "Commentaire": "Performances moyennes - Besoin d'optimisation"
        },
        {
            "Model": "KNeighbors",
            "Accuracy": 0.877941,
            "Precision": 0.449,
            "Recall": 0.408,
            "F1-score": 0.427586,
            "Commentaire": "Difficultés avec les données déséquilibrées"
        },
        {
            "Model": "SVM",
            "Accuracy": 0.866176,
            "Precision": 0.273,
            "Recall": 0.118,
            "F1-score": 0.165138,
            "Commentaire": "Performances faibles - Peu de fraudes détectées"
        },
        {
            "Model": "LogisticRegression",
            "Accuracy": 0.867647,
            "Precision": 0.000,
            "Recall": 0.000,
            "F1-score": 0.000000,
            "Commentaire": "Modèle inefficace - Aucune fraude détectée"
        }
    ]
def get_mock_metrics():
    """Retourne des données simulées pour les tests"""
    mock_data = [
        {
            "Model": "RandomForest",
            "Accuracy": 0.904412,
            "Precision": 0.566,
            "Recall": 0.618,
            "F1-score": 0.580645,
            "Commentaire": "Meilleur modèle - Détection acceptable mais recall à améliorer"
        },
        {
            "Model": "DecisionTree", 
            "Accuracy": 0.885294,
            "Precision": 0.495,
            "Recall": 0.592,
            "F1-score": 0.524390,
            "Commentaire": "Performances moyennes - Besoin d'optimisation"
        },
        {
            "Model": "KNeighbors",
            "Accuracy": 0.877941,
            "Precision": 0.449,
            "Recall": 0.408,
            "F1-score": 0.427586,
            "Commentaire": "Difficultés avec les données déséquilibrées"
        },
        {
            "Model": "SVM",
            "Accuracy": 0.866176,
            "Precision": 0.273,
            "Recall": 0.118,
            "F1-score": 0.165138,
            "Commentaire": "Performances faibles - Peu de fraudes détectées"
        },
        {
            "Model": "LogisticRegression",
            "Accuracy": 0.867647,
            "Precision": 0.000,
            "Recall": 0.000,
            "F1-score": 0.000000,
            "Commentaire": "Modèle inefficace - Aucune fraude détectée"
        }
    ]
    return mock_data




# Route pour récupérer les valeurs aberrantes AVANT correction
@bp.route('/valeurs-aberrantes-avant', methods=['GET'])
def get_valeurs_aberrantes_avant():
    try:
        pf = train_model()
        valeurs_avant = verifier_valeur_aberantes(pf)
        
        return jsonify({
            'success': True,
            'data': valeurs_avant,
            'type': 'avant_correction',
            'message': 'Valeurs aberrantes avant correction'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Route pour récupérer les valeurs aberrantes APRÈS correction
@bp.route('/valeurs-aberrantes-apres', methods=['GET'])
def get_valeurs_aberrantes_apres():
    try:
        pf = train_model()
        _, comparaison = corriger_valeurs_aberantes(pf)  
        
        return jsonify({
            'success': True,
            'data': comparaison['apres_correction'],
            'type': 'apres_correction', 
            'message': 'Valeurs aberrantes après correction'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Route pour récupérer AVANT et APRÈS en une seule requête
@bp.route('/valeurs-aberrantes-comparaison', methods=['GET'])
def get_valeurs_aberrantes_comparaison():
    try:
        pf = train_model()
        _, comparaison = corriger_valeurs_aberantes(pf)  
        
        return jsonify({
            'success': True,
            'data': {
                'avant': comparaison['avant_correction'],
                'apres': comparaison['apres_correction'],
                'statistiques': comparaison['statistiques_globales']
            },
            'message': 'Comparaison complète avant/après correction'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/matrices-confusion', methods=['GET'])
def get_matrices_confusion_dynamique():
    """Version simplifiée qui ré-exécute l'entraînement si nécessaire"""
    try:
        # Ré-exécuter le pipeline pour obtenir les données fraîches
        pf = train_model()
        pf_corrige, _ = corriger_valeurs_aberantes(pf)
        pf_nettoye = supprmer_doublons(pf_corrige)
        X_train, X_test, Y_train, Y_test, _ = preparer_donnees()
        X_train_res, Y_train_res = appliquer_smote(X_train, Y_train)
        X_train_norm, X_test_norm, scaler = appliquer_normalisation(X_train_res, X_test)
        
        # Entraîner les modèles
        df_results, model_metrics, models_entraine,predictions = entrainer_et_evaluer_modeles(
            X_train_res, Y_train_res,
            X_train_norm, X_test, X_test_norm, Y_test
        )
        
        # Générer les matrices de confusion
        matrices_data = []
        for model_name, metrics in model_metrics.items():
            VN = metrics['VN']
            FP = metrics['FP']
            FN = metrics['FN']
            VP = metrics['VP']
            
            matrix = [[int(VN), int(FP)], [int(FN), int(VP)]]
            
            model_data = {
                'model': model_name,
                'matrix': matrix,
                'metrics': {
                    'true_negatives': int(VN),
                    'false_positives': int(FP),
                    'false_negatives': int(FN),
                    'true_positives': int(VP),
                    'precision': float(metrics['precision']),
                    'recall': float(metrics['recall']),
                    'f1_score': float(metrics['f1_score']),
                    'accuracy': float(metrics['accuracy'])
                },
                'image': generate_confusion_matrix_image(matrix, model_name)
            }
            matrices_data.append(model_data)
        
        return jsonify({
            'success': True,
            'data': matrices_data,
            'message': 'Matrices générées dynamiquement depuis le dernier entraînement'
        })
        
    except Exception as e:
        print(f"Erreur: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

def generate_confusion_matrix_image(matrix, model_name):
    """Génère une image base64 de la matrice de confusion"""
    try:
        import matplotlib.pyplot as plt
        import seaborn as sns
        import io
        import base64
        
        plt.figure(figsize=(6, 5))
        sns.heatmap(matrix, annot=True, fmt='d', cmap='Blues', 
                   xticklabels=['Non Fraude', 'Fraude'],
                   yticklabels=['Non Fraude', 'Fraude'])
        plt.title(f"Matrice de confusion - {model_name}")
        plt.xlabel("Prédit")
        plt.ylabel("Réel")
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close()
        
        return f"data:image/png;base64,{image_base64}"
        
    except Exception as e:
        print(f"Erreur génération image: {e}")
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='


# Dans votre fichier Flask, ajoutez cette route
@bp.route('/data-distribution', methods=['GET'])
def get_data_distribution():
    try:
        print("Début de get_data_distribution...")
        
        import pandas as pd
        
        # Chargez vos données
        pf = train_model()
        print(f" Données chargées, shape: {pf.shape}")
        
        # Distribution avant SMOTE
        y_original = pf['PotentialFraud']
        before_counts = y_original.value_counts()
        print(f" Distribution avant SMOTE: {dict(before_counts)}")
        
        # Appliquez SMOTE
        x_train, _, y_train, _, _ = preparer_donnees()

        print("Données préparées pour SMOTE")
        
        _, y_resampled = appliquer_smote(x_train, y_train)
        print("MOTE appliqué")
        
        # Distribution après SMOTE
        after_counts = pd.Series(y_resampled).value_counts()
        print(f"Distribution après SMOTE: {dict(after_counts)}")
        
        distribution_data = {
            'before_smote': {
                'non_fraud': int(before_counts.get(0, 0)),
                'fraud': int(before_counts.get(1, 0))
            },
            'after_smote': {
                'non_fraud': int(after_counts.get(0, 0)),
                'fraud': int(after_counts.get(1, 0))
            },
            'total_before': int(before_counts.sum()),
            'total_after': int(after_counts.sum()),
            'source': 'flask_dynamic',
            'fetchedAt': pd.Timestamp.now().isoformat()
        }
        
        print("🎉 Données SMOTE générées avec succès")
        return jsonify(distribution_data)
        
    except Exception as e:
        print(f"Erreur data-distribution: {str(e)}")
        import traceback
        print(f" Stack trace: {traceback.format_exc()}")
        return jsonify({'error': str(e)}), 500

@bp.route('/data-quality', methods=['GET'])
def get_data_quality():
    try:
        pf = train_model()
        
        # Récupérer toutes les métriques de qualité
        valeurs_manquantes = verifier_valeurs_manquantes(pf)
        valeurs_aberrantes = verifier_valeur_aberantes(pf)
        doublons = verifier_doublons(pf)
        
        quality_data = {
            'valeurs_manquantes': valeurs_manquantes,
            'valeurs_aberrantes': valeurs_aberrantes,
            'doublons': doublons,
            'total_lignes': len(pf),
            'total_colonnes': len(pf.columns),
            'fetchedAt': pd.Timestamp.now().isoformat()
        }
        
        return jsonify({'success': True, 'data': quality_data})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@bp.route('/doublons', methods=['GET'])
def get_doublons():
    try:
        pf = train_model()
        result = verifier_doublons(pf)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/valeurs-aberrantes', methods=['GET'])
def get_valeurs_aberrantes():
    try:
        pf = train_model()
        result = verifier_valeur_aberantes(pf)
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@bp.route('/statistiques-normalisation', methods=['GET'])
def get_statistiques_normalisation():
    try:
        from ..Model.Entrainement import get_normalisation_stats
        
        print("🔍 Début de la route /statistiques-normalisation")
        stats = get_normalisation_stats()
        
        return jsonify({
            'success': True,
            'data': stats,
            'message': 'Statistiques de normalisation récupérées avec succès'
        })
        
    except Exception as e:
        print(f"ERREUR dans statistiques-normalisation: {str(e)}")
        import traceback
        print(f" Stack trace: {traceback.format_exc()}")
        return jsonify({
            'success': False, 
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@bp.route('/supprimer-doublons', methods =['GET'])
def supprimer_doublons_api():
    pf = train_model()
    resultat = supprmer_doublons(pf)
    return jsonify(resultat)

@bp.route('/data', methods=['GET'])
def get_data():
    data = train_model()  
    return jsonify(data) 

@bp.route('/check-metrics-files', methods=['GET'])
def check_metrics_files():
    """Vérifie l'état des fichiers de métriques"""
    import os
    
    files_status = {
        'model_metrics.pkl': os.path.exists('Model/model_metrics.pkl'),
        'model_metrics.csv': os.path.exists('Model/model_metrics.csv'),
        'creditcarddata.csv': os.path.exists('Model/creditcarddata.csv')
    }
    
    # Lister le contenu du dossier Model
    model_files = []
    if os.path.exists('Model'):
        model_files = os.listdir('Model')
    
    return jsonify({
        'files_status': files_status,
        'model_files': model_files
    })
from flask import Blueprint, jsonify, request
import joblib as jb
@bp.route('/predict', methods=['POST'])
def predict_fraud():
    try:
        print(" Début de la prédiction...")
        
        # 1. Charger le modèle et le scaler
        best_model_path = "Model/RandomForest_best_model.pkl"
        scaler_path = "Model/scaler.pkl"
        columns_path = "Model/columns_to_normalize.pkl"
        
        model = jb.load(best_model_path)
        scaler = jb.load(scaler_path)
        columns_to_normalize = jb.load(columns_path)
        
        print(" Modèle et scaler chargés")

        # 2. Récupérer les données de la requête
        data = request.get_json()
        print(" Données reçues:", data)

        # 3. Mapping des données comme dans votre frontend
        features = {
            'Gender': int(data.get('Gender', 0)),
            'Age': int(data.get('Age', 0)),
            'HouseTypeID': int(data.get('HouseTypeID', 0)),
            'ContactAvaliabilityID': int(data.get('ContactAvaliabilityID', 0)),
            'HomeCountry': int(data.get('HomeCountry', 0)),
            'AccountNo': int(data.get('AccountNo', 0)),
            'CardExpiryDate': int(data.get('CardExpiryDate', 0)),
            'TransactionAmount': float(data.get('TransactionAmount', 0.0)),
            'TransactionCountry': int(data.get('TransactionCountry', 0)),
            'LargePurchase': 1 if float(data.get('TransactionAmount', 0)) > 1000 else 0,
            'ProductID': int(data.get('ProductID', 0)),
            'CIF': int(data.get('CIF', 0)),
            'TransactionCurrencyCode': int(data.get('TransactionCurrencyCode', 0))
        }

        # 4. Créer le DataFrame dans le bon ordre
        feature_names = [
            'Gender', 'Age', 'HouseTypeID', 'ContactAvaliabilityID', 
            'HomeCountry', 'AccountNo', 'CardExpiryDate', 'TransactionAmount',
            'TransactionCountry', 'LargePurchase', 'ProductID', 'CIF', 
            'TransactionCurrencyCode'
        ]
        
        input_df = pd.DataFrame([[
            features['Gender'],
            features['Age'], 
            features['HouseTypeID'],
            features['ContactAvaliabilityID'],
            features['HomeCountry'],
            features['AccountNo'],
            features['CardExpiryDate'],
            features['TransactionAmount'],
            features['TransactionCountry'],
            features['LargePurchase'],
            features['ProductID'],
            features['CIF'],
            features['TransactionCurrencyCode']
        ]], columns=feature_names)

        print(" DataFrame créé:", input_df.shape)
        print(" Valeurs:", input_df.iloc[0].to_dict())

        # 5. Appliquer la normalisation uniquement aux colonnes spécifiques
        input_normalized = input_df.copy()
        
        # Vérifier les colonnes disponibles pour la normalisation
        available_columns = [col for col in columns_to_normalize if col in input_df.columns]
        print(f" Colonnes à normaliser: {available_columns}")
        
        if available_columns:
            input_normalized[available_columns] = scaler.transform(input_df[available_columns])
        
        print(" Normalisation appliquée")

        # 6. Faire la prédiction
        prediction = model.predict(input_normalized)
        probability = model.predict_proba(input_normalized)
        
        prob_fraud = float(probability[0][1])
        prob_legit = float(probability[0][0])
        
        # Déterminer le niveau de risque
        if prob_fraud >= 0.7:
            risk_level = 'HIGH'
        elif prob_fraud >= 0.4:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'

        print(f" Prédiction: {prediction[0]}, Probabilité fraude: {prob_fraud:.3f}")

        # 7. Retourner la réponse
        response = {
            'success': True,
            'prediction': int(prediction[0]),
            'probability_fraud': prob_fraud,
            'probability_legit': prob_legit,
            'risk_level': risk_level,
            'confidence': max(prob_fraud, prob_legit)
        }
        
        print(" Prédiction réussie:", response)
        return jsonify(response)
        
    except Exception as e:
        print(f" Erreur lors de la prédiction: {str(e)}")
        import traceback
        print(f" Stack trace: {traceback.format_exc()}")
        
        return jsonify({
            'success': False, 
            'error': f"Erreur serveur: {str(e)}"
        }), 500
from flask import current_app as app

