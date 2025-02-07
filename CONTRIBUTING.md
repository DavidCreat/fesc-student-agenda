# Contribuyendo a FESC Student Agenda

¡Primero que todo, gracias por considerar contribuir a FESC Student Agenda! 👍

## 📝 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Estilo de código](#estilo-de-código)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)

## 📜 Código de Conducta

Este proyecto y todos sus participantes están bajo el [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, se espera que mantengas este código. Por favor, reporta comportamiento inaceptable a [davidfonseca12p@gmail.com](mailto:davidfonseca12p@gmail.com).

## 🤝 ¿Cómo puedo contribuir?

### 🐛 Reportando Bugs

- Usa el buscador de issues para ver si el bug ya ha sido reportado
- Si no encuentras un issue abierto que aborde el problema, crea uno nuevo
- Incluye un título claro y descripción detallada
- Añade tanto detalle como sea posible: pasos para reproducir, comportamiento esperado vs actual
- Incluye capturas de pantalla si es relevante

### 💡 Sugiriendo Mejoras

- Primero, lee la documentación y asegúrate de que la funcionalidad no existe
- Busca en los issues existentes para ver si la mejora ya ha sido sugerida
- Crea un nuevo issue describiendo detalladamente la mejora
- Incluye casos de uso específicos y beneficios de la mejora

### 👩‍💻 Código

1. Fork el repositorio
2. Clona tu fork: `git clone https://github.com/tu-usuario/fesc-student-agenda.git`
3. Crea una rama para tus cambios: `git checkout -b feature/nombre-caracteristica`
4. Haz tus cambios
5. Ejecuta las pruebas: `npm test`
6. Commit tus cambios: `git commit -am 'Add some feature'`
7. Push a la rama: `git push origin feature/nombre-caracteristica`
8. Envía un Pull Request

## 🎨 Estilo de código

- Usamos TypeScript para todo el código
- Seguimos las reglas de ESLint configuradas en el proyecto
- Usamos Prettier para formateo de código
- Nombres de variables y funciones en camelCase
- Nombres de componentes React en PascalCase
- Comentarios en español

### 📝 Convenciones de código

```typescript
// Interfaces
interface IUser {
  id: string;
  name: string;
}

// Componentes React
const UserProfile: React.FC<IUser> = ({ id, name }) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

// Funciones
function calculateUserScore(points: number): number {
  return points * 100;
}
```

## 💬 Commit Messages

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva característica
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` cambios de formato
- `refactor:` refactorización de código
- `test:` añadir o modificar tests
- `chore:` cambios en el proceso de build o herramientas

Ejemplos:
```bash
feat: añadir sistema de notificaciones
fix: corregir error en calendario
docs: actualizar README
```

## 🚀 Pull Requests

1. Actualiza el README.md con detalles de los cambios si es necesario
2. Actualiza la versión en package.json siguiendo [SemVer](http://semver.org/)
3. El PR será revisado por al menos un mantenedor
4. Una vez aprobado, será mezclado a la rama principal

## ⭐️ Reconocimiento

- Tu nombre será añadido a la lista de contribuidores en el README
- Contribuciones significativas serán destacadas en el CHANGELOG

---

¡Gracias por contribuir! 🎉
