import requests
from bs4 import BeautifulSoup
import os
from PIL import Image
from io import BytesIO

# URL da página de aromaterapia
url = 'https://www.recantodasessencias.com.br/aromaterapia'

# Cabeçalho para simular um navegador (alguns sites bloqueiam requisições sem user-agent)
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
}

# Fazer a requisição para a página
response = requests.get(url, headers=headers)
response.raise_for_status()  # Levanta um erro se a requisição falhar

# Parse do conteúdo HTML
soup = BeautifulSoup(response.text, 'html.parser')

# Encontrar todos os itens da classe 'item flex'
items = soup.find_all(class_='item flex')

# Criar diretório para salvar os dados
os.makedirs('aromaterapia_items', exist_ok=True)

# Função para salvar imagem
def save_image(image_url, filename):
    try:
        img_response = requests.get(image_url)
        img_response.raise_for_status()
        img = Image.open(BytesIO(img_response.content))
        img.save(filename)
        print(f"Imagem salva: {filename}")
    except Exception as e:
        print(f"Erro ao salvar imagem: {e}")

# Iterar sobre os itens encontrados e salvar as informações
for index, item in enumerate(items):
    # Extrair informações de texto
    title = item.find('h3').text.strip() if item.find('h3') else 'Sem Título'
    description = item.find('p').text.strip() if item.find('p') else 'Sem Descrição'

    # Salvar as informações de texto em um arquivo
    item_filename = f'aromaterapia_items/item_{index + 1}.txt'
    with open(item_filename, 'w', encoding='utf-8') as file:
        file.write(f"Title: {title}\n")
        file.write(f"Description: {description}\n")
    print(f"Informações salvas em: {item_filename}")

    # Extrair e salvar a imagem
    img_tag = item.find('img')
    if img_tag and img_tag.get('src'):
        img_url = img_tag['src']
        img_filename = f'aromaterapia_items/image_{index + 1}.jpg'
        save_image(img_url, img_filename)
