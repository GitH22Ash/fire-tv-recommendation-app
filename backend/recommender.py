import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# --- Function 1: Content-Based Recommendations ---
def content_based_recommendation(movie_id, new_df, top_n=5):
    """
    Generates content-based recommendations for a given movie ID.
    """
    print(f"Generating content-based recommendations for movie_id: {movie_id}")
    
    # Find the row for the target movie
    index_series = new_df.loc[new_df["id"] == movie_id]
    
    if index_series.empty:
        print(f"Warning: Movie with ID {movie_id} not found in the database.")
        return []

    index = index_series.index[0]

    # --- FIX STARTS HERE ---
    # We will wrap the embedding access in try-except blocks to handle missing data gracefully.

    # Calculate overview similarity (assuming this always exists)
    target_vector_overview = np.array(new_df.loc[index, 'overview_embedding']).reshape(1, -1)
    new_df['overview_similarity'] = new_df['overview_embedding'].apply(
        lambda x: cosine_similarity(np.array(x).reshape(1, -1), target_vector_overview)[0][0]
    )

    # Calculate genres similarity
    target_vector_genres = np.array(new_df.loc[index, 'genres_embedding']).reshape(1, -1)
    new_df['genres_similarity'] = new_df['genres_embedding'].apply(
        lambda x: cosine_similarity(np.array(x).reshape(1, -1), target_vector_genres)[0][0]
    )
    
    # Initialize production company similarity to zero
    new_df['production_companies_similarity'] = 0.0
    
    # Safely calculate production company similarity
    try:
        # This will only run if the column exists and the movie has the data
        target_vector_prod_cos = np.array(new_df.loc[index, 'production_companies_companies']).reshape(1, -1)
        new_df['production_companies_similarity'] = new_df['production_companies_companies'].apply(
            lambda x: cosine_similarity(np.array(x).reshape(1, -1), target_vector_prod_cos)[0][0]
        )
    except KeyError:
        # If the column 'production_companies_companies' doesn't exist, we print a warning
        # and continue, instead of crashing the server.
        print("Warning: 'production_companies_companies' column not found. Skipping this feature.")
    except Exception as e:
        print(f"Warning: Could not calculate production company similarity for movie ID {movie_id}. Error: {e}")


    # Calculate the weighted average similarity score
    new_df['Movie_Similarity'] = (
        0.3 * new_df['genres_similarity'] +
        0.5 * new_df['overview_similarity'] +
        0.2 * new_df['production_companies_similarity'] # This will be 0 if the feature was missing
    )
    # --- FIX ENDS HERE ---
    
    # Get the top N most similar movies, excluding the movie itself
    top_recommendations = new_df.sort_values(by='Movie_Similarity', ascending=False)[1:top_n+1]
    
    return top_recommendations['id'].tolist()


# --- Function 2: User-Based (Collaborative Filtering) Recommendations ---
def create_pseudo_user_vector(watched_movie_ids, movie_factors, n_factors):
    """
    Creates an average vector representing the user's taste based on their watch history.
    """
    pseudo_user_vector = np.zeros(n_factors)
    count = 0
    for movie_id in watched_movie_ids:
        if movie_id in movie_factors:
            pseudo_user_vector += movie_factors[movie_id]
            count += 1
    if count > 0:
        return pseudo_user_vector / count
    else:
        return np.zeros(n_factors)

def user_based_recommendation(watched_movie_ids, model, all_movie_ids, movie_factors, raw_to_inner_iid_map, top_n=10):
    """
    Generates user-based recommendations using a trained SVD model.
    """
    print(f"Generating user-based recommendations for history: {watched_movie_ids}")
    
    pseudo_user_vector = create_pseudo_user_vector(watched_movie_ids, movie_factors, model.n_factors)
    
    movies_to_predict = all_movie_ids - set(watched_movie_ids)
    
    predictions = []
    for movie_id in movies_to_predict:
        if movie_id in raw_to_inner_iid_map:
            movie_inner_id = raw_to_inner_iid_map[movie_id]
            estimated_rating = np.dot(pseudo_user_vector, model.qi[movie_inner_id])
            predictions.append((movie_id, estimated_rating))
            
    predictions.sort(key=lambda x: x[1], reverse=True)
    
    recommended_movie_ids = [pred[0] for pred in predictions[:top_n]]
    
    return recommended_movie_ids
